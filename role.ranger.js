/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.ranger');
 * mod.thing == 'a thing'; // true
 */

require('prototype.Creep')();
var Cache      = require('help.cache');
var WarManager = require('goto.war');


/*///////////////// Needs From WarManager ///////////////
WarManager.timeToAttack       (creep, cache)
WarManager.stackOnRoomEntrance(creep, cache)
WarManager.getTargetFor       (creep, cache)
///////////////////////////////////////////////////////*/

module.exports = {
    run: function(creep, cache) {
        if(!creep.memory.target)
            creep.memory.target = WarManager.getTargetFor(creep, cache);

        var target = creep.memory.target;
        if(!target)return;
        target = _.merge(target, RoomPosition.prototype);

        if(!WarManager.timeToAttack(creep)){
            WarManager.stackOnRoomEntrance(creep);
        }
        else{
            creep.moveTo(target);
            var mobileTargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            var staticTargets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
            if (mobileTargets || staticTargets) {creep.rangedMassAttack();}
            if(! Utils.posEquals(creep.pos, target))
                creep.moveTo(target.x, target.y, {ignoreDestructibleStructures: true});
            if(mobileTargets.length + staticTargets.length > 3)
                creep.rangedMassAttack();
            if(mobileTargets.length)
                creep.rangedAttack(creep.pos.findClosestByRange(mobileTargets));
            else if(staticTargets.length)
                creep.rangedAttack(creep.pos.findClosestByRange(staticTargets));
        }

    }
};

/*
 creep.moveTo(target);
            var mobileTargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            var staticTargets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
            if (mobileTargets || staticTargets) {creep.rangedMassAttack();}
            if(! Utils.posEquals(creep.pos, target))
                creep.moveTo(target.x, target.y, {ignoreDestructibleStructures: true});
            if(mobileTargets.length + staticTargets.length > 3)
                creep.rangedMassAttack();
            if(mobileTargets.length)
                creep.rangedAttack(creep.pos.findClosestByRange(mobileTargets));
            else if(staticTargets.length)
                creep.rangedAttack(creep.pos.findClosestByRange(staticTargets));
        }
*/