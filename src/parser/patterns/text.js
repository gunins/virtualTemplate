import {inScope, joinString} from './utils';

const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);
const textTemplate = (uid, tag, value) => `<${tag} id="${uid}">${value}</${tag}>`;
const text = ({template, rendered,...args}, {uid, values}) => values
    .reduce(({template, rendered}, {path, value, head}) => ({
        template: template.replace(tagEmptyRegex(uid), (_, tag) => textTemplate(uid, tag, value)),
        rendered: [...rendered, {path: joinString('.')(head, path), value, uid, type: 'text'}],
        ...args
    }), {template, rendered,...args});

const inText = inScope(({binding}, paths) => paths.filter(({path}) => path === binding));
const isText = ({bindingType}) => bindingType === 'text';


export {text, inText,isText}