/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.tower');
 * mod.thing == 'a thing'; // true
 */
var Const = require('help.constants');
var Cache = require('help.cache');

module.exports = {
    run: function(tower, cache) {
        //Attack functions
        if(tower.room.memory.hasThreats) {
//            console.log('tower attack');
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
//            console.log('tower attacking');
                tower.attack(closestHostile);
            }
        } // End Attack functions
        
        // Heal functions
        var needHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(c){c.hits < c.maxHits}});
        if(needHeal) {
            console.log('tower heal');
//            tower.heal(needHeal);
        } // End Heal functions

        // wallRepair functions
        if((Game.time % Const.TOWER_REPAIR_DELAY) == 0 && (tower.energy/tower.energyCapacity) > Const.TOWER_REPAIR_THRESHOLD){
//            console.log('tower repair');
            var targets = cache.get(tower.pos.roomName+'_walls');
            var target = undefined;

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

            if(rampartTarget && rampartTarget.hits != rampartTarget.hitsMax && rampartTarget.hits < wallTarget.hits) {
                target = rampartTarget;
            } else {
                target = wallTarget;
            }

            //console.log(creep.name + '\tTarget pos: ' + target.pos);
            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                    tower.repair(target);
               } 
        } // End wallRepair functions
    }
};