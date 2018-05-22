import {option} from '../utils/option';
import {uid} from './patterns/utils';
import {text, inText, isText} from './patterns/text';
import {attribute, isAttribute, inAttributes} from './patterns/attribute';
import {block, isBlock, inBlock} from './patterns/block'


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

const templateRenderer = ({template, bindings}, paths, id = uid()) => bindings
    .reduce((_, binding) => [..._, findPath(binding, paths)], [])
    .reduce((_, {bindingType, ...data}) => setBinding(bindingType)(_, data), {
        template: addTemplateId(template, id),
        rendered:[],
        id
    });


export {templateRenderer};