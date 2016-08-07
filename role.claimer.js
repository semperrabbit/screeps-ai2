module.exports = {
    run: function(creep) {
        var otw = Game.flags['Reserve'].pos
        var dest = Game.flags['Reserve'].pos.roomName
        if (creep.pos == Game.flags['Reserve'].pos){
            creep.memory.state = 'claim';}

        creep.say(creep.memory.state)
        switch(creep.memory.state){
            case 'exit':
                creep.moveTo(Game.flags.Reserve);
                if (creep.pos.isEqualTo(Game.flags.Reserve.pos)){creep.memory.state = 'claim';}
                break;
            case 'claim':
                if (creep.room.name != dest) {
                    creep.memory.state='exit';
                }
                switch(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(creep.room.controller);
                        break;
                    case ERR_GCL_NOT_ENOUGH:
                        creep.memory.state = 'reserve';
                        break;
                }
                break;
            case 'reserve':
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
                break;
    
        
            default:
                creep.attackController(creep.room.controller)
        }
    }
};
//{var test = Game.flags['Reserve'].pos.roomName;console.log(Game.rooms[test].controller.my);}