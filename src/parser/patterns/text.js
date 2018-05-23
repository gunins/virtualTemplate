import {inScope, joinString, concat} from './utils';

const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);
const textTemplate = (uid, tag, value) => `<${tag} id="${uid}">${value}</${tag}>`;
const text = ({template, rendered}, {uid, values}) => values
    .reduce(({template, rendered}, {path, value, head}) => ({
        template: template.replace(tagEmptyRegex(uid), (_, tag) => textTemplate(uid, tag, value)),
        rendered: concat(rendered, {path: joinString('.')(head, path), value, uid, type: 'text'})
    }), {template, rendered});

const inText = inScope(({binding}, paths) => paths.filter(({path}) => path === binding));
const isText = ({bindingType}) => bindingType === 'text';


export {text, inText,isText}