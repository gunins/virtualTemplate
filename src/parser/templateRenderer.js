import {diff, flatten} from '../diff/Diff';
import {filterMap} from '../utils/FilterMap';
import {option} from "../utils/option";

const tagBegin = (current, attribute) => option()
    .or(current, () => new RegExp(`(^<[a-z-]+\\s+id="[^"]+".*?)(${attribute}=${current})`))
    .finally(() => new RegExp(`^<[a-z-]+\\s+id="[^"]+"`));


const textTemplate = (uid, tag, value) => `<${tag} id="${uid}">${value}</${tag}>`;


const tagAttributeRegex = (uid) => new RegExp(`<[a-z-]+\\s+id="${uid}"(.|\\n)*?>`);

const tagTextRegex = (uid) => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);

const updateAttribute = (_, {current, attribute, value}) => _
    .replace(tagBegin(current, attribute), (_, curr) => option()
        .or(current, () => curr + `${attribute}="${value} ${current.replace(/"/g, '')}"`)
        .finally(() => _ + ` ${attribute}="${value}"`));

const setAttributes = (match, attributes, {path, value}) => attributes
    .filter(({binding}) => binding === path)
    .reduce((_, {attribute, value: current}) => updateAttribute(_, {current, attribute, value}), match)

const attribute = (template, {uid, attributes}, binding) => template
    .replace(tagAttributeRegex(uid), match => setAttributes(match, attributes, binding));


const text = (template, {uid}, {value}) => template.replace(tagTextRegex(uid), (match, tag) => textTemplate(uid, tag, value));

const block = (_) => _;


const setBinding = (type) => (_, ...args) => type ? ({text, attribute, block})[type](_, ...args) : _;

const inAttributes = (path, array) => array.filter(({binding}) => binding === path).length > 0;

const add = (_, {path, value}, bindings) => bindings
    .filter(({binding, attributes}) => option().or(attributes, () => inAttributes(path, attributes)).finally(() => binding === path))
    .reduce((_, {bindingType, ...data}) => setBinding(bindingType)(_, data, {path, value}), _);

const update = (_) => _;
const remove = (_) => _;

const jobs = key => (...args) => ({update, add, remove})[key](...args);
const prepareTemplate = (template, process, key, bindings) => process[key].reduce((_, bind) => jobs(key)(_, bind, bindings), template);

const defaults = {order: ['remove', 'update', 'add']};
const templateRenderer = ({template, bindings}, options = {}) => {
    let currentData = filterMap();
    const {order} = {...options, ...defaults};
    return {
        render(data) {
            const newData = flatten(data);
            const process = diff(newData, currentData);
            currentData = data;
            const output = order.reduce((_, key) => prepareTemplate(_, process, key, bindings), template);
            return output;
        }
    }
};
export {templateRenderer};