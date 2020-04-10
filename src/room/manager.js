"use strict";

let mod = {};

module.exports = mod;

const
    GLOBALS = require('globals.global');

mod.run = function () {

    let myRooms = _.filter(Game.rooms, {'my': true});

    for (let room of myRooms) {
        //console.log(`rooms: ${room.name} RCL: ${room.RCL}`);
        room.checkRCL();
        room.saveSpawns();
        let accessibleFields = room.sourceAccessibleFields;
        console.log(`${GLOBALS.json(accessibleFields)}`);
        //for (let AccessibleField of AccessibleFields)
        //    console.log(`${AccessibleField}`);
    }
};







