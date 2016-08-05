require('prototype.Creep')();

var roleBuilder = require('role.builder');
var Utils = require('help.functions');

module.exports = {
    // a function to run the logic for this role
    run: function(creep, cache) {
        if(creep.spawning){ return;}
        Utils.pickupNearbyEnergy(creep);
        // if creep is trying to repair something but has no energy left
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false; creep.memory.stateTransition = true;  break;
            case creep.carryCapacity:  creep.memory.working = true;  creep.memory.stateTransition = true;  break;
        }

//        roleBuilder.run(creep);return;

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find all walls in the room
            var targets = cache.get(creep.pos.roomName+'_walls');
            var target = undefined;
//console.log(targets)
            if(_.isUndefined(targets) || targets < 0){roleBuilder.run(creep); return;}
            if(creep.memory.stateTransition){
                creep.memory.stateTransition = false;
                var wallTarget = undefined;
                var wallTargetPerc = 1.0;
    
                var rampartTarget = undefined;
                var rampartTargetPerc = 1.0;
    
                for(let i in targets) {
                    if(((targets[i].hits/targets[i].hitsMax) < wallTargetPerc) && targets[i].structureType == STRUCTURE_WALL) {
                        wallTarget     = targets[i];
                        wallTargetPerc = targets[i].hits/targets[i].hitsMax;
                    }
                    if(((targets[i].hits/targets[i].hitsMax) < rampartTargetPerc) && targets[i].structureType == STRUCTURE_RAMPART) {
                        rampartTarget     = targets[i];
                        rampartTargetPerc = targets[i].hits/targets[i].hitsMax;
                    }
                }
    
                if( rampartTarget && rampartTarget.hits != rampartTarget.hitsMax && rampartTarget.hits < wallTarget.hits) {
                    target = rampartTarget;
                } else {
                    target = wallTarget;
                }
                creep.memory.target = target.id;
            }

            if(!_.isUndefined(creep.memory.target))
                target = Game.getObjectById(creep.memory.target);

            //console.log(creep.name + '\tTarget pos: ' + target.pos);
            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
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
            Utils.harvest(creep);
        }
    }
};

