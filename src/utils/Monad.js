const {isArray} = Array;

const _value = Symbol('_value');

class Monad {
    constructor(value = {}) {
        this.value = value;
    }

    identity() {
        return {};
    }

    get value() {
        return this[_value];
    }

    set value(value) {
        this[_value] = value;
        return this;
    }

    map(fn) {
        return monad(fn(this.value))
    }

    flatMap(fn) {
        const result = fn(this.value);
        if (!result.isMonad || !result.isMonad()) {
            throw new ReferenceError('Must return an Monad');
        }
        return result;
    }

    toString() {
        return '[object Monad]';
    }

    isMonad() {
        return this.toString() === '[object Monad]';
    }

    toObj() {
        return this.value;
    }

}

const monad = (...args) => new Monad(...args);

export {Monad, monad}