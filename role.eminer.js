require('prototype.Creep')();
var Utils = require('help.functions');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.spawning){ return;}
        if(creep.memory.imHome == false)
        {   creep.moveToHomeRoom();}

        var container, source;
        if(creep.memory.source)
            source = Game.getObjectById(creep.memory.source);
        if(Memory.sources[source.id].container)
            container = Game.getObjectById(Memory.sources[source.id].container);

        target = container || source;

        creep.moveTo(target);
//console.log(creep.name+' moveing to '+target)
        creep.harvest(source);
        //moveTo()
    }
};
