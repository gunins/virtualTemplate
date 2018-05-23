import {inScope, joinString, concat} from './utils';
import {lensPath, over, set} from '../../utils/lenses';
import {compose} from '../../utils/curry';

const templateLens = lensPath('template');
const renderedLens = lensPath('rendered');
const pathLens = lensPath('path');

const tagEmptyRegex = uid => new RegExp(`<([a-z-]+)\\s+id="${uid}">.*?</\\1>`);
const textTemplate = (uid, tag, value) => `<${tag} id="${uid}">${value}</${tag}>`;

const inText = inScope(({binding}, paths) => paths.filter(({path}) => path === binding));
const isText = ({bindingType}) => bindingType === 'text';

const setTemplate = (template, uid, {value}) => template.replace(tagEmptyRegex(uid), (_, tag) => textTemplate(uid, tag, value));

const setRendered = (source, uid, {head, path, value}) => concat(source, compose(
    set(pathLens, joinString('.')(head, path))
)({
    value,
    uid,
    type: 'text'
}));

const text = (_, {uid, values}) => values
    .reduce((acc, _) => compose(
        over(templateLens, template => setTemplate(template, uid, _)),
        over(renderedLens, rendered => setRendered(rendered, uid, _))
    )(acc), _);


export {text, inText, isText}