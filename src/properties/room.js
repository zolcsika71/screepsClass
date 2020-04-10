"use strict";

let mod = {};

module.exports = mod;

const
    UTIL = require('util'),
    GLOBALS = require('globals.global');


mod.extend = () => {

    let Structures = function (room) {
        this.room = room;
        Object.defineProperties(this, {
            'all': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._all)) {
                        this._all = this.room.find(FIND_STRUCTURES);
                    }
                    return this._all;
                }
            },
            'my': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._my)) {
                        this._my = this.room.find(FIND_MY_STRUCTURES);
                    }
                    return this._my;
                }
            },
            'towers': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._towers)) {
                        this._towers = [];
                        var add = id => {
                            addById(this._towers, id);
                        };
                        _.forEach(this.room.memory.towers, add);
                    }
                    return this._towers;
                }
            },
            'repairable': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._repairable)) {
                        let that = this;
                        this._repairable = _.sortBy(
                            that.all.filter(
                                structure => Room.shouldRepair(that.room, structure)
                            ),
                            'hits'
                        );
                    }
                    return this._repairable;
                }
            },
            'urgentRepairable': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._urgentRepairableSites)) {
                        var isUrgent = site => (site.hits < (LIMIT_URGENT_REPAIRING + (DECAY_AMOUNT[site.structureType] || 0)));
                        this._urgentRepairableSites = _.filter(this.repairable, isUrgent);
                    }
                    return this._urgentRepairableSites;
                }
            },
            'feedable': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._feedable)) {
                        this._feedable = this.extensions.concat(this.spawns);
                    }
                    return this._feedable;
                }
            },
            'fortifyable': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._fortifyableSites)) {
                        let that = this;
                        this._fortifyableSites = _.sortBy(
                            that.all.filter(
                                structure => (
                                    that.room.my &&
                                    structure.hits < structure.hitsMax &&
                                    structure.hits < global.MAX_FORTIFY_LIMIT[that.room.controller.level] &&
                                    (structure.structureType !== STRUCTURE_CONTAINER || structure.hits < global.MAX_FORTIFY_CONTAINER) &&
                                    (!global.DECAYABLES.includes(structure.structureType) || (structure.hitsMax - structure.hits) > global.GAP_REPAIR_DECAYABLE * 3) &&
                                    (Memory.pavementArt[that.room.name] === undefined || Memory.pavementArt[that.room.name].indexOf(`x${structure.pos.x}y${structure.pos.y}x`) < 0) &&
                                    (!global.FlagDir.list.some(f => f.roomName === structure.pos.roomName && f.color === COLOR_ORANGE && f.x === structure.pos.x && f.y === structure.pos.y))
                                )
                            ),
                            'hits'
                        );
                    }
                    return this._fortifyableSites;
                }
            },
            'fuelable': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._fuelables)) {
                        let that = this,
                            factor = that.room.situation.invasion ? 1 : 0.82,
                            fuelable = target => (target.energy < (target.energyCapacity * factor));
                        this._fuelables = _.sortBy(_.filter(this.towers, fuelable), 'energy') ; // TODO: Add Nuker
                    }
                    return this._fuelables;
                }
            },
            'container' : {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._container)) {
                        this._container = new Room.Containers(this.room);
                    }
                    return this._container;
                }
            },
            'links' : {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._links)) {
                        this._links = new Room.Links(this.room);
                    }
                    return this._links;
                }
            },
            'labs' : {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._labs)) {
                        this._labs = new Room.Labs(this.room);
                    }
                    return this._labs;
                }
            },
            'extensions': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this.room.memory.extensions)) {
                        this.room.saveExtensions();
                    }
                    if (_.isUndefined(this._extensions)) {
                        this._extensions = _.map(this.room.memory.extensions, e => Game.getObjectById(e));
                    }
                    return this._extensions;
                }
            },
            'spawns': {
                configurable: true,
                get: function () {
                    if (_.isUndefined(this._spawns)) {
                        this._spawns = [];
                        let addSpawn = id => {
                            global.addById(this._spawns, id);
                        };
                        _.forEach(this.room.memory.spawns, addSpawn);
                    }
                    return this._spawns;
                }
            }
        });
    };

    Object.defineProperties(Room.prototype, {
        'structures': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this._structures)) {
                    this._structures = new Structures(this);
                }
                return this._structures;
            }
        },
        'my': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this._my)) {
                    this._my = this.controller && this.controller.my;
                }
                return this._my;
            }
        },
        'RCL': {
            configurable: true,
            get() {
                if (!this.controller) return;
                return UTIL.get(this.memory, 'RCL', this.controller.level);
            }
        },
        'sources': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this.memory.sources) || this.name === 'sim') {
                    this._sources = this.find(FIND_SOURCES);
                    if (this._sources.length > 0) {
                        this.memory.sources = this._sources.map(s => s.id);
                    } else this.memory.sources = [];
                }
                if (_.isUndefined(this._sources)) {
                    this._sources = [];
                    let addSource = id => {
                        GLOBALS.addById(this._sources, id);
                    };
                    this.memory.sources.forEach(addSource);
                }
                return this._sources;
            }
        },
        'sourceAccessibleFields': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this.memory.sourceAccessibleFields) || this.memory.sourceAccessibleFields === null) {
                    let sourceAccessibleFields = 0,
                        sources = this.sources,
                        countAccess = source => sourceAccessibleFields += source.accessibleFields;

                    _.forEach(sources, countAccess);
                    this.memory.sourceAccessibleFields = sourceAccessibleFields;
                }
                return this.memory.sourceAccessibleFields;
            }
        },
        'sourceEnergyAvailable': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this._sourceEnergyAvailable)) {
                    this._sourceEnergyAvailable = 0;
                    var countEnergy = source => (this._sourceEnergyAvailable += source.energy);
                    _.forEach(this.sources, countEnergy);
                }
                return this._sourceEnergyAvailable;
            }
        },
        'ticksToNextRegeneration': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this._ticksToNextRegeneration)) {
                    this._ticksToNextRegeneration = _(this.sources).map('ticksToRegeneration').min() || 0;
                }
                return this._ticksToNextRegeneration;
            }
        },
        'myConstructionSites': {
            configurable: true,
            get: function () {
                if (_.isUndefined(this._myConstructionSites)) {
                    this._myConstructionSites = this.find(FIND_MY_CONSTRUCTION_SITES);
                }
                return this._myConstructionSites;
            }
        }

    });
}

