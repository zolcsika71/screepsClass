"use strict";

let mod = {};

module.exports = mod;

const
    GLOBALS = require('globals.global'),
    PARAMETERS = require('globals.parameter'),
    ROOM_MANAGER = require('room.manager'),
    PROPERTIES_ROOM = require('properties.room'),
    PROPERTIES_ROOM_OBJECT = require('properties.roomObject'),
    PROTOTYPES_ROOM = require('prototypes.room');

mod.run = () => {
    PROPERTIES_ROOM.extend();
    PROPERTIES_ROOM_OBJECT.extend();
    PROTOTYPES_ROOM.extend();
    ROOM_MANAGER.run();
};




