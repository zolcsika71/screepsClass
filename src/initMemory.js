
let mod = {};
mod.init = (withDelete = false) => {

    if (withDelete)
        delete Memory;

    Memory.modules = {};

};
module.exports = mod;
