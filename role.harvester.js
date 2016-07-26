module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the spawn or an extension but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => s.energy < s.energyCapacity
            });

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);//, [{reusePath}]);
                }
            }else {

                // loop with increasing percentages
                for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                    // find a wall with less than percentage hits
    
                    // for some reason this doesn't work
                    // target = creep.pos.findClosestByPath(walls, {
                    //     filter: (s) => s.hits / s.hitsMax < percentage
                    // });
    
                    // so we have to use this
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => ((s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] / s.storeCapacity < percentage) ||
                                        (s.structureType == STRUCTURE_STORAGE   && s.store[RESOURCE_ENERGY] / s.storeCapacity < percentage))
                    });
    
                    // if there is one
                    if (target != undefined) {
                        // break the loop
                        break;
                    }
                }
    
                // if we find a wall that has to be repaired
                if(target != undefined) {
                    // try to deposit to it, if not in range
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(target);
                    }
                }

            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var target = undefined;
            var source = creep.pos.findClosestByPath(FIND_SOURCES, function(s){s.energy > 0});
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source)//, [{reusePath}];
            }
        }
    }
};