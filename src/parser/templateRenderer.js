import {option} from '../utils/option';
import {concat, templateId} from './patterns/utils';
import {monad} from '../utils/Monad';
import {text, inText, isText} from './patterns/text';
import {attribute, isAttribute, inAttributes} from './patterns/attribute';
import {block, isBlock, inBlock} from './patterns/block'
import {compose, curry} from '../utils/curry';
import {lensPath, over, set, view} from '../utils/lenses';

const uidLens = lensPath('uid');
const templateLens = lensPath('template');
const bindingsLens = lensPath('bindings');
const valueLens = lensPath('value');

const beginningTag = /(<[a-z|-]+)\s*(id="([^"]+)")*\s*/;
const idTemplate = (_, id) => `${_} id="${id}" `;

const setBinding = type => (template, ...args) => option()
    .or(type, () => ({
            text,
            attribute,
            block
        })[type](template, ...args)
    ).finally(() => template);


const findPath = (binding, paths) => option()
    .or(isBlock(binding), () => inBlock(binding, paths))
    .or(isAttribute(binding), () => inAttributes(binding, paths))
    .or(isText(binding), () => inText(binding, paths))
    .finally(() => ({}));

const updateBinding = (_, oldId, newId) => oldId ? concat(_.filter(({uid}) => uid !== oldId), set(uidLens, newId, _.find(({uid}) => uid === oldId))) : _;


const updateBindings = (bindings, newId) => {
    return {
        replaceId(currentId) {
            bindings = updateBinding(bindings, currentId, newId);
        },
        get value() {
            return bindings;
        }
    }
}
const setTemplate = curry((fn, uid, template) => template.replace(beginningTag, (_, tag, idSegment, currentId) => {
    fn(currentId);
    return idTemplate(tag, uid)
}));

const addTemplateId = ({template, bindings}, uid) => {
    const setBindings = updateBindings(bindings, uid);
    const addId = setTemplate(currentId => setBindings.replaceId(currentId));
    template = addId(uid, template);
    return compose(
        set(bindingsLens, view(valueLens, setBindings)),
    )({template, uid})
};

const findBindings = (paths) => bindings => bindings.reduce((_, binding) => [..._, findPath(binding, paths)], []);
const setBindings = (acc) => bindings => bindings.reduce((_, {bindingType, ...data}) => setBinding(bindingType)(_, data), acc);

const templateRenderer = (_, paths, uid = templateId()) => monad(addTemplateId(_, uid))
    .map(({template, bindings, uid}) =>
        compose(
            _ => ({..._, uid}),
            setBindings({
                template,
                rendered: []
            }),
            findBindings(paths)
        )(bindings)
    ).toObj();


export {templateRenderer};