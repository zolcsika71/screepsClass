"use strict";

let mod = {};

module.exports = mod;

mod.extend = () => {
    Object.defineProperty(RoomObject.prototype, 'accessibleFields', {
        configurable: true,
        get: function () {
            if (this.memory && !_.isUndefined(this.memory.accessibleFields)) {
                return this.memory.accessibleFields;
            } else {
                let fields = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
                let walls = _.countBy(fields, "terrain").wall;
                let accessibleFields = walls === undefined ? 9 : 9 - walls;
                return (this.memory) ? this.memory.accessibleFields = accessibleFields : accessibleFields;
            }
        }
    });
}
