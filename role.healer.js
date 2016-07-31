require('prototype.Creep')();

module.exports = {
    run: function(creep) {
        if(creep.spawning){ return;}
        var targ = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (creep) => creep.hits < creep.hitsMax
        })
        if (creep.heal(targ) == ERR_NOT_IN_RANGE) {
            // move towards the source
            creep.moveTo(targ);
        }
    }
};