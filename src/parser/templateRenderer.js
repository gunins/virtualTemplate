import {option} from '../utils/option';

const idGenerator = (template = _ => `${_}`) => {
    let id = 0;
    return () => template(++id);
};
const beginningTag = /^\s*(<[a-z|-]+)\s*id="[^"]+"/;
const tagWithID = (current, attribute) => option()
    .or(current, () => new RegExp(`(^<[a-z-]+\\s+id="[^"]+".*?)(${attribute}=${current})`))
    .finally(() => new RegExp(`^<[a-z-]+\\s+id="[^"]+"`));


const tagAttributeRegex = (uid) => new RegExp(`<[a-z-]+\\s+id="${uid}"(.|\\n)*?>`);
const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);


const uid = idGenerator((id) => `template_${Date.now()}_${id}`);
const idTemplate = (_, id) => `${_} id="${id}"`;


const updateAttribute = (_, {current, attribute, value}) => _
    .replace(tagWithID(current, attribute), (_, curr) => option()
        .or(current, () => curr + `${attribute}="${value} ${current.replace(/"/g, '')}"`)
        .finally(() => _ + ` ${attribute}="${value}"`));

const setAttributes = (match, {attributes, values}) => attributes
    .map(({attribute, value: current, binding}) => ({
        attribute,
        current,
        value: (values.find(({path}) => binding === path) || {}).value
    }))
    .filter(({value}) => value)
    .reduce((_, {attribute, current, value}) => updateAttribute(_, {current, attribute, value}), match)

const attribute = (template, {uid, attributes, values}) => template
    .replace(tagAttributeRegex(uid), match => setAttributes(match, {attributes, values}));

const textTemplate = (uid, tag, value) => `<${tag} id="${uid}">${value}</${tag}>`;
const text = (template, {uid, values}) => values
    .reduce((_, {value}) => _
        .replace(tagEmptyRegex(uid), (_, tag) => textTemplate(uid, tag, value)), template);

const flattenBlock = (_, obj, index) => ([..._.filter((_, i) => i !== index), [..._.find((_, i) => i === index) || [], obj]]);

const groupValues = (array) => array.reduce((acc, {path: segment, value}) => {
    const [head, tail] = segment.split(/\.(.+)/);
    const index = isNaN(+head) ? 0 : +head;
    const path = isNaN(+head) ? segment : tail;
    return flattenBlock(acc, {path, value}, index)
}, []);

const block = (template, {uid, children, values}) => template
    .replace(tagEmptyRegex(uid), () => groupValues(values)
        .map(_ => templateRenderer(children, _))
        .join('\n'));


const setBinding = type => (template, ...args) => option()
    .or(type, () => ({
            text,
            attribute,
            block
        })[type](template, ...args)
    ).finally(() => template);

const inScope = filter => (paths, bindings) => {
    const values = filter(paths, bindings);
    return option()
        .or(values.length > 0, () => ({...bindings, values}))
        .finally(() => ({}))
};

const inBlock = inScope((paths, {blockName}) => paths.map(({path, value}) => {
    const [head, tail] = path.split(/\.(.+)/);
    return ({value, path: tail, head})
}).filter(({head}) => blockName === head));

const inAttributes = inScope((paths, {attributes}) => paths
    .filter(({path}) => attributes.find(({binding}) => binding === path)));

const inText = inScope((paths, {binding}) => paths.filter(({path}) => path === binding));

const isBlock = ({bindingType}) => bindingType === 'block';
const isText = ({bindingType}) => bindingType === 'text';
const isAttribute = ({bindingType}) => bindingType === 'attribute';

const findPath = (paths, _) => option()
    .or(isBlock(_), () => inBlock(paths, _))
    .or(isAttribute(_), () => inAttributes(paths, _))
    .or(isText(_), () => inText(paths, _))
    .finally(() => ({}));

const templateRenderer = ({template, bindings}, values, id = uid()) => bindings
    .reduce((_, binding) => [..._, findPath(values, binding)], [])
    .reduce((_, {bindingType, ...data}) => setBinding(bindingType)(_, data), template)
    .replace(beginningTag, (_,tag) => idTemplate(tag, id));


export {templateRenderer};