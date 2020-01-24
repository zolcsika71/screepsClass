"use strict";

function wrapLoop(fn) {
    let memory,
        tick;

    return () => {
        if (tick && tick + 1 === Game.time && memory) {
            delete global.Memory;
            Memory = memory;
        } else
            memory = Memory;

        tick = Game.time;
        fn();

        // there are two ways of saving Memory with different advantages and disadvantages
        // 1. RawMemory.set(json.stringify(Memory));
        // + ability to use custom serialization method
        // - you have to pay for serialization
        // - unable to edit Memory via Memory watcher or console
        // 2. RawMemory._parsed = Memory;
        // - undocumented functionality, could get removed at any time
        // + the server will take care of serialization, it doesn't cost any CPU on your site
        // + maintain full functionality including Memory watcher and console

        RawMemory._parsed = Memory;
    };
}

function validatePath(path) {
    let mod;
    try {
        mod = require(path);
    }
    catch (e) {
        if (!(e.message && e.message.startsWith('Unknown module'))) {
            console.log('<font style="color:FireBrick">Error loading ' + path
                + ' caused by ' + (e.stack || e.toString()) + '</font>');
        }
        mod = null;
    }
    return mod != null;
}
function getPath(modName, reevaluate = false) {
    if (reevaluate || !Memory.modules[modName]) {
        // find base file
        let path;
        for (let dir of global.DIR) {
            path = dir + modName;
            if (!validatePath(path))
                Memory.modules[modName] = path;
        }
        // find viral file
        path = './viral.' + modName;
        if (validatePath(path))
            Memory.modules.viral[modName] = true;
        else if (Memory.modules.viral[modName])
            delete Memory.modules.viral[modName];
    }
    return Memory.modules[modName];
}

function tryRequire(path, silent = false) {

    let mod;
    try {
        mod = require(path);
    } catch (e) {
        if (e.message && e.message.indexOf('Unknown module') > -1) {
            if (!silent)
                console.log(`Module "${path}" not found!`);
        } else if (mod == null)
            console.log(`Error loading module "${path}"!<br/>${e.stack || e.toString()}`);

        mod = null;
    }
    return mod;
}

function inject(base, alien, namespace) {
    let keys = _.keys(alien);
    for (const key of keys) {
            if (typeof alien[key] === "function") {
            if (namespace) {
                let original = base[key];
                if (!base.baseOf) base.baseOf = {};
                if (!base.baseOf[namespace]) base.baseOf[namespace] = {};
                if (!base.baseOf[namespace][key]) base.baseOf[namespace][key] = original;
            }
            base[key] = alien[key].bind(base);
        } else if (alien[key] !== null && typeof base[key] === 'object' && !Array.isArray(base[key]) &&
            typeof alien[key] === 'object' && !Array.isArray(alien[key])) {
            _.merge(base[key], alien[key]);
        } else
            base[key] = alien[key];
    }
}

function infect(mod, namespace, modName) {

    if (Memory.modules[namespace][modName]) {
        // get module from stored viral override path
        let viralOverride = tryRequire(`./${namespace}.${modName}`);
        // override
        if (viralOverride)
            inject(mod, viralOverride, namespace);
        // cleanup
        else
            delete Memory.modules[namespace][modName];
    }
    return mod;
}

function load(modName) {
    // read stored module path
    let path = getPath(modName);
    // try to load module
    let mod = tryRequire(path, true);
    if (!mod) {
        // re-evaluate path
        path = getPath(modName, true);
        // try to load module. Log error to console.
        mod = tryRequire(path);
    }
    if (mod) {
        // load viral overrides
        mod = infect(mod, 'viral', modName);
    }
    return mod;
}

let mainInjection = load("mainInjection"),
    cpuAtLoad = Game.cpu.getUsed(),
    cpuAtFirstLoop;

if (Memory.modules === undefined)  {
    Memory.modules = {
        valid: Game.time,
        viral: {}
    };
} else if (_.isUndefined(Memory.modules.valid))
        Memory.modules.valid = Game.time;

// Initialize global & parameters
inject(global, load("global"));
_.assign(global, load("parameter"));














