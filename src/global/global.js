"use strict";

let mod = {};
module.exports = mod;

/**
 * Returns a HTML formatted string with the style applied
 * @param {Object|string} style - Either a colour string or an object with CSS properties
 * @param {...string} text - The text to format
 * @returns {string}
 */
mod.dye = (style, ...text) => {
    const msg = text.join(' ');
    if (mod.isObject(style)) {
        let css = '',
            format = key => css += `${key}: ${style[key]};`;
        _.forEach(Object.keys(style), format);
        return `<span style="${css}">${msg}</span>`;
    }
    if (style)
        return `<span style="color: ${style}">${msg}</span>`;

    return msg;
};

/**
 * Logs an error to console
 * @param {string} message - A string describing the error
 * @param {*} [entityWhere] - The entity where the error was caused
 */
mod.logError = (message, entityWhere) => {
    const msg = mod.dye(global.CRAYON.error, message);
    if (entityWhere) {
        mod.trace('error', entityWhere, msg);
    } else {
        console.log(msg, mod.stack());
    }
};
/**
 * Log text as a system message showing a "preFix" as a label
 * @param {string} preFix - text displaying before message
 * @param {...string} message - The message to log
 */
mod.logSystem = (preFix, ...message) => {
    let text = mod.dye(global.CRAYON.system, preFix);
    console.log(mod.dye(global.CRAYON.system, `<a href="/a/#!/room/${Game.shard.name}/${preFix}">${text}</a> &gt;`), ...message, mod.stack());
};
/**
 * console any object
 * @param {object}
 */

mod.BB = x => {
    console.log(JSON.stringify(x, null, 2));
};
mod.json = x => {
    return JSON.stringify(x, null, 2);
};

