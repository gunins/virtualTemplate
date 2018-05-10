const option = (...methods) => ({
    or(bool, left) {
        return option(...methods, {bool, left})
    },
    finally(right) {
        const {left} = methods.find(({bool}) => bool) || {};
        return left ? left() : right();
    }
});

export {option}