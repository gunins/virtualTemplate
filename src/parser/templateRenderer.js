import {option} from '../utils/option';
import {templateId} from './patterns/utils';
import {text, inText, isText} from './patterns/text';
import {attribute, isAttribute, inAttributes} from './patterns/attribute';
import {block, isBlock, inBlock} from './patterns/block'
import {compose} from '../utils/curry';

const beginningTag = /(<[a-z|-]+)\s*(id='[^']+')*\s*/;
const idTemplate = (_, id) => `${_} id='${id}' `;

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

const addTemplateId = (template, id) => template.replace(beginningTag, (_, tag) => idTemplate(tag, id));

const findBindings = (paths) => bindings => bindings.reduce((_, binding) => [..._, findPath(binding, paths)], []);
const setBindings = (acc) => bindings => bindings.reduce((_, {bindingType, ...data}) => setBinding(bindingType)(_, data), acc);

const templateRenderer = ({template, bindings}, paths, uid = templateId()) => compose(
    (_) => ({..._, uid}),
    setBindings({
        template: addTemplateId(template, uid),
        rendered: []
    }),
    findBindings(paths)
)(bindings);


export {templateRenderer};