require('prototype.Creep')();

var Utils = require('help.functions');
var roleHarvester = require('role.harvester');

module.exports = {
    // a function to run the logic for this role
    run: function(creep){
        if(creep.spawning){ return;}


        Utils.pickupNearbyEnergy(creep);
        if(!creep.memory.source){
            console.log('no source in memory')
            return -1;
        }
        var source    = Game.getObjectById(creep.memory.source);
        var sourcePos = Utils.getObjectPosById(creep.memory.source);
//console.log(creep.name + ': Source pos:'+sourcePos);

        // if creep is supposed to transfer energy to the spawn or an extension
//                role working homeRoom source roomTransition rtIndex dir
        if (creep.memory.working) {
            if(creep.pos.roomName == creep.memory.homeRoom) {
                roleHarvester.run(creep);
            } else { 
                var roomEnd = undefined;
                var rmTrans = creep.memory.roomTransition[creep.memory.rtIndex];
                if(creep.pos.x == rmTrans.src.x && creep.pos.y == rmTrans.src.y && 
                        creep.pos.roomName == rmTrans.src.roomName) {
                // if at the end of the room, move to the next room
                    creep.moveTo(new RoomPosition(rmTrans.dst.x, rmTrans.dst.y, rmTrans.dst.roomName));
//                    creep.memory.rtIndex--;
                } else { //if not at end of room,
                    creep.moveTo(new RoomPosition(rmTrans.src.x, rmTrans.src.y, rmTrans.src.roomName));
                }
            
            }
        }else {
        // if creep is supposed to harvest energy from source
        // role working homeRoom source roomTransition rtIndex dir
            if(sourcePos.roomName == creep.pos.roomName) {
            // if in the same room as the source
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {reusePath: 10});
                }
            } else { // not in the same room
                var roomEnd = undefined;
                var rmTrans = creep.memory.roomTransition[creep.memory.rtIndex];
                if(creep.pos.x == rmTrans.dst.x && creep.pos.y == rmTrans.dst.y && 
                        creep.pos.roomName == rmTrans.dst.roomName) {
                // if at the end of the room, move to the next room
                    creep.moveTo(new RoomPosition(rmTrans.src.x, rmTrans.src.y, rmTrans.src.roomName));
//                    creep.memory.rtIndex++;
                } else { //if not at end of room,
                    creep.moveTo(new RoomPosition(rmTrans.dst.x, rmTrans.dst.y, rmTrans.dst.roomName));
                }
            }
        }
        // if creep is harvesting energy but is full
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity){
            // switch state
            creep.memory.working = true;
        }

    }
};