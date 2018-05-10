const {from: toArray} = Array;

class FilterMap extends Map {
    map(fn) {
        const map = new FilterMap();
        this.forEach((value, key) => map.set(key, fn(value, key, this)));
        return map;
    }

    filter(fn) {
        const map = new FilterMap();
        return this.reduce((_, key, value) => fn(key, value) ? _.set(key, value) : _, map)
    }

    reduce(fn, acc) {
        return toArray(this).reduce((acc, [key, value]) => acc === undefined ? value : fn(acc, key, value), acc);
    }
};

const filterMap = (...args) => new FilterMap(...args);

export {FilterMap, filterMap}