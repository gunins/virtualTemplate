import {inScope, joinString, concat, find} from './utils';
import {option} from '../../utils/option';
import {lensPath, set, view, over} from '../../utils/lenses';
import {compose} from '../../utils/curry';

const templateLens = lensPath('template');
const renderedLens = lensPath('rendered');
const pathLens = lensPath('path');
const typeLens = lensPath('type');
const attributeLens = lensPath('attribute');
const valueLens = lensPath('value');


const tagAttributeRegex = (uid) => new RegExp(`<[a-z-]+\\s+id="${uid}"(.|\\n)*?>`);
const tagWithID = (current, attribute) => option()
    .or(current, () => new RegExp(`(^<[a-z-]+\\s+id="[^"]+".*?)(${attribute}=${current})`))
    .finally(() => new RegExp(`^<[a-z-]+\\s+id="[^"]+"`));

const isAttribute = ({bindingType}) => bindingType === 'attribute';
const inAttributes = inScope(({attributes}, paths) => paths
    .filter(({path}) => attributes.find(({binding}) => binding === path)));

const updateAttribute = (_, {current, attribute, value}) => _
    .replace(tagWithID(current, attribute), (_, curr) => option()
        .or(current, () => curr + `${attribute}="${value} ${current.replace(/"/g, '')}"`)
        .finally(() => _ + ` ${attribute}="${value}"`));

const setAttributes = (match, {attributes, values}) => attributes
    .map(({attribute, value: current, binding}) => compose(
        set(valueLens, find(valueLens, values, ({path}) => binding === path))
    )({
        attribute,
        current
    }))
    .filter(({value}) => value)
    .reduce((_, data) => updateAttribute(_, data), match);


const setTemplate = (template, {uid, ...data}) => template.replace(tagAttributeRegex(uid), match => setAttributes(match, data));

const setRendered = (rendered, {values, attributes, uid}) => concat(rendered, values.map(({path, value, head}) => compose(
    set(pathLens, joinString('.')(head, path)),
    set(typeLens, find(attributeLens, attributes, ({binding}) => binding === path))
)({value, uid})));

const attribute = (_, data) => compose(
    over(templateLens, template => setTemplate(template, data)),
    over(renderedLens, rendered => setRendered(rendered, data))
)(_);
export {attribute, isAttribute, inAttributes}