require('prototype.Creep')();

var Utils = require('help.functions');
var roleBuilder = require('role.builder');

//        Utils.pickupNearbyEnergy(creep);

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.spawning){ return;}
        if(creep.memory.imHome == false || !creep.memory.imHome)
        {   creep.moveToHomeRoom();}
        Utils.pickupNearbyEnergy(creep);

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
//            console.log('Depositing')
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => s.energy < s.energyCapacity// && (s.structureType!= STRUCTURE_TOWER)
            });

            // if we found one
            if (structure != undefined) {
//console.log('depositing to storage');
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);//, [{reusePath}]);
                }
            }else {

                // so we have to use this
//console.log('depositing to storage');
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => ((s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) ||
                                    (s.structureType == STRUCTURE_STORAGE   && s.store[RESOURCE_ENERGY] < s.storeCapacity))
                });

                // if we find a wall that has to be repaired
                if(target != undefined && !Memory.sources[creep.memory.source].hasMiner ) {
                    // try to deposit to it, if not in range
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(target);
                    }
                } else if(creep.room.storage){
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(s){return ((s.structureType == STRUCTURE_STORAGE   && s.store[RESOURCE_ENERGY] < s.storeCapacity))}
                });

                    // try to deposit to it, if not in range
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(target);
                    }
                }else{
                    roleBuilder.run(creep);
                }
                
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            if(Memory.sources[creep.memory.source].hasMiner)
                Utils.harvest(creep);
            else
                harvest(creep);
        }
    }
};

var harvest = function(creep) {
//    console.log('Harvesting');
    var target = undefined;
    var source = undefined;
    
    if(!_.isUndefined(creep.memory.source))
        source = Game.getObjectById(creep.memory.source);
    else
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)//, {filter: function(s){s.energy > 0}});

    if(!source.memory.hasMiner && source.memory.container){
//console.log('doesnt have miner but does have container')
        cont = Game.getObjectById(source.memory.container);
        if(cont && (cont.store.energy / cont.storeCapacity) > .1)
//console.log('pulling from container')
            if(creep.withdraw(cont, 'energy') == ERR_NOT_IN_RANGE)
                creep.moveTo(cont);
        
    }

    // try to harvest energy, if the source is not in range
    if(!(source == undefined || source == null)){
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            // move towards the source
            creep.moveTo(source)//, [{reusePath}];
        }
    }
    source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(c){return c.structureType == STRUCTURE_STORAGE}})
}