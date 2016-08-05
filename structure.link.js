var Cache = require('help.cache');
var Const = require('help.constants');
var Utils = require('help.functions');

module.exports = {
    run: function(room, cache ) {
        if(Game.time % Const.LINK_RUN_DELAY == 0) {
            var links = Utils.findStructuresByType(room, STRUCTURE_LINK);

                if(_.isUndefined(Memory.rooms[room.name].links)){
                    Memory.rooms[room.name].links = {};
                }


            var controllerLink = undefined;
            var storageLink    = undefined;
            for(link of links) {
                if(link.pos.findInRange(FIND_MY_STRUCTURES, 5, {filter: function(s) { return s.structureType == STRUCTURE_CONTROLLER } } ) >= 0 ) {
                    storageLink = link;
                    Memory.rooms[room.name].links.storageLink = link.id;
                    cache.set(room.name+'_StorageLink', link);
                    continue;
                }
                if(link.pos.findInRange(FIND_MY_STRUCTURES, 5, {filter: function(s) { return s.structureType == STRUCTURE_STORAGE } } ) >= 0 ) {
                    controllerLink = link;
                    Memory.rooms[room.name].links.controllerLink = link.id;
                    cache.set(room.name+'_ControllerLink', link);
                    continue;
                }
            }
            if(controllerLink == undefined || storageLink == undefined){
                return;
            }
            if(//((controllerLink.energy / controllerLink.energyCapacity) < (1-Const.LINK_SEND_THRESHOLD)) &&
               ((storageLink.energy    / storageLink.energyCapacity)    > Const.LINK_SEND_THRESHOLD)) {
                storageLink.transferEnergy(controllerLink);
            }
        }
    }
};