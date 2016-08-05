require('prototype.Creep')();

var roleBuilder = require('role.builder');
var Utils = require('help.functions');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.spawning){ return;}
        Utils.pickupNearbyEnergy(creep);
       // if creep is trying to repair something but has no energy left
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false;  break;
            case creep.carryCapacity:  creep.memory.working = true;   break;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find closest structure with less than max hits
            // Exclude walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => s.hits < s.hitsMax && (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
            });

            // if we find one
            if (structure != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            Utils.harvest(creep, null)
        }
    }
};
