const tagMatch = /<[a-z|-]+[^>]*?(={[a-z.A-Z0-9]+})+(.|\n)*?>/g;
const textMatch = /{{[a-zA-Z0-9.]*}}/g;
//Magic taking matching block. Neet more study to understand this.
const blockMatch = /{#([a-zA-Z0-9.]+)\s*}((.|\n*?)+){\/\1\s*}/g;

const reduceTag = (tag, attributes) => attributes
    .reduce((_, {attribute, value, path}) => _.replace(path, value ? `${attribute}=${value}` : ''), tag)
    .replace(/\s\s+\n*/g, ' ');

const extractAttributes = tag => tag
    .match(/[a-z-]+={[a-z.A-Z0-9]+}("[^"]+")*/g)
    .map((_) => _.match(/([a-z-]+)={([^}]+)}("([^"]+)")*/))
    .map(([path, attribute, binding, value]) => ({
        attribute,
        value,
        binding,
        path
    }));
const extractBinding = _ => _.match(/{{(.*?)}}/)[1];

const idTemplate = (_, id) => `${_} id="${id}"`;
const textTemplate = (id) => `<span id="${id}"></span>`;
const blockTemplate = (id, [_,tag] = [false,'span']) => `<${tag} id="${id}"></${tag}>`;

const tagId = id => `tag_${Date.now()}_${id}`;
const textId = id => `text_${Date.now()}_${id}`;
const blockId = id => `block_${Date.now()}_${id}`;

const addId = (tag, id) => tag.replace(/^<[a-z|-]+/, _ => idTemplate(_, id));
const setTag = (_, uid) => {
    const bindingType = 'attribute';
    const rawTag = addId(_, uid);
    const attributes = extractAttributes(rawTag);
    const tag = reduceTag(rawTag, attributes);
    return {uid, bindingType, tag, attributes};
};

const setTextNode = (_, uid) => {
    const bindingType = 'text';
    const tag = textTemplate(uid);
    const binding = extractBinding(_);
    return {uid, bindingType, tag, binding}
};


const setBlock = (_, blockName, block, uid) => {
    const bindingType = 'block';
    const tag = blockTemplate(uid, _.match(/<([a-z-]+)/));
    const children = templateParser(block);

    return {uid, bindingType, tag, blockName, children}

};

const templateParser = (html) => {
    let id = 0;
    let bindings = [];
    const template = html
        .replace(blockMatch, (match, blockName, block) => {
            const _ = setBlock(match, blockName, block, blockId(id++));
            bindings = [...bindings, _];
            return _.tag;
        })
        .replace(tagMatch, (match) => {
            const _ = setTag(match, tagId(id++));
            bindings = [...bindings, _];
            return _.tag;
        })
        .replace(textMatch, (match) => {
            const _ = setTextNode(match, textId(id++));
            bindings = [...bindings, _];
            return _.tag;
        });

    return {template, bindings}
};


export {templateParser}