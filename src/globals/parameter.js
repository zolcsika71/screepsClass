"use strict";

const ME = _(Game.rooms).map('controller').filter('my').map('owner.username').first();

let parameter = {
    ME: ME

}

module.exports = parameter;
