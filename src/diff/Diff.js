import {filterMap} from '../utils/FilterMap';
import {option} from '../utils/option';

const isObject = _ => _ && typeof _ === 'object' && _.constructor === Object;
const {isArray, from: toArray} = Array;
const {keys, assign} = Object;

const addTo = (acc, method, obj) => assign(acc, {[method]: [...acc[method], obj]})

const isValid = _ => isObject(_) || isArray(_);


const setValue = (acc, value, path) => acc.set(path, value);
const setKeys = (obj, acc, root) => keys(obj).reduce((acc, key) => flatten(obj[key], acc, root ? [root, key].join('.') : key), acc);

const flatten = (obj, acc = filterMap(), root) => isValid(obj) ? setKeys(obj, acc, root) : setValue(acc, obj, root);


const leftExists = (path, value, target) => !!(target.has(path) && target.get(path) !== value);
const rightExists = (path, target) => !target.has(path);
const notExists = (source, path) => !source.has((path));

const setResult = (path, value, target, acc) => option()
    .or(leftExists(path, value, target), () => addTo(acc, 'update', {path, value}))
    .or(rightExists(path, target), () => addTo(acc, 'add', {path, value}))
    .finally(() => acc);

const deprecated = (source, target) => target.filter((path) => notExists(source, path));
const convert = (source, target) => toArray(deprecated(source, target))
    .map(([path, value]) => ({path, value}));

const diff = (source = filterMap(), target = filterMap()) => source.reduce((_, path, value) => setResult(path, value, target, _), {
    update: [],
    add:    [],
    remove: convert(source, target)
});

export {diff, flatten}