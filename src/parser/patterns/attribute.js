import {inScope, joinString, concat} from './utils';
import {option} from '../../utils/option';

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
    .map(({attribute, value: current, binding}) => ({
        attribute,
        current,
        value: (values.find(({path}) => binding === path) || {}).value
    }))
    .filter(({value}) => value)
    .reduce((_, {attribute, current, value}) => updateAttribute(_, {current, attribute, value}), match);

const attribute = ({template, rendered}, {uid, attributes, values}) => {
    return ({
        template: template.replace(tagAttributeRegex(uid), match => setAttributes(match, {attributes, values})),
        rendered:concat(rendered, values.map(({path, value, head}) => ({
            path: joinString('.')(head, path),
            value,
            uid,
            type: (attributes.find(({binding}) => binding === path) || {}).attribute
        })))
    });
};
export {attribute, isAttribute, inAttributes}