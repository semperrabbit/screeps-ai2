require('prototype.Creep')();

var Cache = require('help.cache');
var Utils = require('help.functions');

module.exports = {
    // a function to run the logic for this role
    run: function(creep, cache) {
        if(creep.spawning){ return;}
        if(creep.memory.imHome == false || !creep.memory.imHome)
        {   creep.moveToHomeRoom();}
        Utils.pickupNearbyEnergy(creep);
        // if creep is bringing energy to the controller but has no energy left
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false;  break;
            case creep.carryCapacity:  creep.memory.working = true;   break;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(Game.rooms[creep.memory.homeRoom].controller);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            Utils.harvest(creep, cache);
        }
    }
};

