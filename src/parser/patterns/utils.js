import {option} from '../../utils/option';
import {over, view} from '../../utils/lenses';
import {curry} from '../../utils/curry';

const {isArray} = Array;
const inScope = filter => (bindings, paths) => {
    const values = filter(bindings, paths);
    return option()
        .or(values.length > 0, () => ({...bindings, values}))
        .finally(() => ({}))
};

const idGenerator = (template = _ => `${_}`) => {
    let id = 0;
    return () => template(++id);
};
const templateId = idGenerator((id) => `template_${Date.now()}_${id}`);

const joinString = (separator = '.') => (...args) => args.filter(_ => _ !== undefined).join(separator);

const concat = (...arrays) => arrays.reduce((acc, _) => option().or(isArray(_), () => [...acc, ..._]).or(_, () => [...acc, _]).finally(() => acc), []);

const fold = curry((lens, fn, left, right) => left.reduce((acc, obj) => over(lens, left => fn(left, view(lens, obj)), acc), right));
const combine = curry((lens, fn, left, right, acc) => over(lens, () => fn(view(lens, left), view(lens, right)), acc));

const find = curry((lens, array, fn) => view(lens, array.find(_ => fn(_))));

const getHead = _ => _.split(/\.(.+)/);

export {inScope, idGenerator, templateId, joinString, fold, concat, combine, getHead, find}