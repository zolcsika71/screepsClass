
// save original API functions
let find = Room.prototype.find,
    mod = {};

module.exports = mod;

mod.extend = () => {

    Room.prototype.checkRCL = function () {
        if (!this.controller) return;
        if (this.memory.RCL !== this.controller.level) {
            this.memory.RCL = this.controller.level;
        }
    };

    Room.prototype.find = function (c, opt) {
        if (_.isArray(c)) {
            return _(c)
            .map(x => find.call(this, x, opt))
            .flatten()
            .value();
        } else
            return find.apply(this, arguments);
    };

    Room.prototype.saveSpawns = function () {
        let spawns = this.find(FIND_MY_SPAWNS);
        if (spawns.length > 0) {
            let id = o => o.id;
            this.memory.spawns = _.map(spawns, id);
        } else delete this.memory.spawns;
    };
}



