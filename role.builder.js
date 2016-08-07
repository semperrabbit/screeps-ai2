var roleUpgrader = require('role.upgrader');
var Utils = require('help.functions');
require('prototype.Creep')();

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.spawning){ return;}

        if(creep.memory.imHome == false)
        {   creep.moveToHomeRoom();}

        // if creep is trying to complete a constructionSite but has no energy left
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false;  break;
            case creep.carryCapacity:  creep.memory.working = true;   break;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
//            if(!_.isUndefined(creep.pos.findInRange(FIND_SOURCES, 1))){
//                creep.move()
//            }
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite)//, [{reusePath}];
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
//                if(creep.room.controller.my)
                    roleUpgrader.run(creep);
//                else;
//                    creep.memory.role = 'remote';
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            Utils.harvest(creep, null);
        }
    }
};
