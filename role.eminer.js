require('prototype.Creep')();

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.spawning){ return;}
        // if creep is bringing energy to the spawn or an extension but has no energy left
        switch(creep.carry.energy)
        {   case 0:                    creep.memory.working = false;  break;
            case creep.carryCapacity:  creep.memory.working = true;   break;
        }

        if(creep.memory.source)
            source = Game.getObjectById(creep.memory.source);
        if(Memory.sources[source.id].container)
            container = Game.getObjectById(Memory.sources[source.id].container);

        target = container || source;

        creep.moveTo(target);
        console.log(creep.name+' moveing to '+target)
        creep.harvest(source);
        //moveTo()
    }
};
