"use strict";

let mod = {};

module.exports = mod;

mod.get = (object, path, defaultValue, setDefault = true) => {
    const r = _.get(object, path);
    if (_.isUndefined(r) && !_.isUndefined(defaultValue) && setDefault) {
        defaultValue = mod.fieldOrFunction(defaultValue);
        _.set(object, path, defaultValue);
        return _.get(object, path);
    }
    return r;
};

mod.fieldOrFunction = (value, ...args) => {
    return typeof value === 'function' ? value(...args) : value;
};
