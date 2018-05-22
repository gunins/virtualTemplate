import {option} from '../../utils/option';

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
const uid = idGenerator((id) => `template_${Date.now()}_${id}`);

const joinString = (separator = '.') => (...args) => args.filter(_ => _ !== undefined).join(separator);

const objMap = _ => fn => fn(_);

export {inScope, idGenerator, uid, joinString, objMap}