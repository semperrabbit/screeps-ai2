require('prototype.Creep')();

var Utils = require('help.functions');
var roleHarvester = require('role.harvester');

module.exports = {
    // a function to run the logic for this role
    run: function(creep){
        if(creep.spawning){ return;}


        Utils.pickupNearbyEnergy(creep);
        if(!creep.memory.target){
            console.log('no target in memory')
            return -1;
        }
        if(_.isUndefined(creep.memory.target))
            creep.memory.target = creep.memory.target;


        var target    = Game.getObjectById(creep.memory.target);
        var targetPos = Utils.getObjectPosById(creep.memory.target);
//console.log(creep.name + ': target pos:'+targetPos);

        // if creep is supposed to transfer energy to the spawn or an extension
//                role working homeRoom target roomTransition rtIndex dir
        if (creep.memory.working) {
            if(creep.pos.roomName == creep.memory.homeRoom) {
//console.log(creep.name + ' in homeRoom, running harvester');
                roleHarvester.run(creep);
            } else { 
//console.log(creep.name + ' not in home room, moving to homeroom');
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
        } else {
        // if creep is supposed to harvest energy from target
        // role working homeRoom target roomTransition rtIndex dir
            if(targetPos.roomName == creep.pos.roomName) {
            // if in the same room as the target
//console.log(creep.name + ' in target room, harvesting');
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 10});
                }
            } else { // not in the same room
//console.log(creep.name + ' not in target room, running harvester');
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
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false;  break;
            case creep.carryCapacity:  creep.memory.working = true;   break;
        }
    }
};