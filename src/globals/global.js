"use strict";

let mod = {};

module.exports = mod;

mod.json = function (x) {
    return JSON.stringify(x, null, 2);
};

mod.addById = function (array, id) {
    if (array == null)
        array = [];
    let obj = Game.getObjectById(id);
    if (obj)
        array.push(obj);
    return array;
};


