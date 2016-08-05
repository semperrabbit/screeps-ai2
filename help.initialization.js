/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.initialization');
 * mod.thing == 'a thing'; // true
 */
var Const = require('help.constants');

function Init() {};

Init.sourcesInMemory = function(){
    if(_.isUndefined(Memory.sources))
        Memory.sources={};

    for(roomName in Game.rooms){
        var currRoom = Game.rooms[roomName];
        var sourceList = currRoom.find(FIND_SOURCES);
        for (let currSource of sourceList) {
            var id = currSource.id;
            if(_.isUndefined(Memory.sources[id]))
                Memory.sources[id] = {total: 0, names: []};
            Memory.sources[id].total=0;
            Memory.sources[id].names=[];

            if(_.isUndefined(Memory.sources[id].container)) {
                var containerList = currSource.pos.findInRange(FIND_STRUCTURES, 1, {filter: (c)=>c.structureType==STRUCTURE_CONTAINER});
                if(containerList && containerList.length > 0)
                    Memory.sources[id].container = containerList[0].id;
            }
            var miner = currSource.room.find(FIND_MY_CREEPS, {filter: function(c){return c.memory.source==id && c.memory.role=='miner'}});
            if(miner.length)// if theres more than 0
                Memory.sources[id].hasMiner=true;
            else
                Memory.sources[id].hasMiner=false;
            if(miner.length && miner[0].ticksToLive < Const.ZOMBIE_TICK)
                Memory.sources[id].hasMiner=false;
        }
    }
    for(creepName in Game.creeps){
        var currCreep = Game.creeps[creepName];
        if(_.isUndefined(currCreep.memory.source) || currCreep.memory.source=={}) continue;
        var id=currCreep.memory.source;
        Memory.sources[id].names.push(currCreep.name);
        Memory.sources[id].total++;
    }
}

module.exports = Init;