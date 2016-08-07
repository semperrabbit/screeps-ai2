module.exports = {
    run: function(creep) {
        if (Game.flags['Attack']){
        var invadeRoom = Game.flags['Attack'].pos.roomName;
        var flag = Game.flags['Attack'].pos;}
        var targ2 = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targ = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) => s.structureType != STRUCTURE_CONTROLLER});

        if (targ2){
            code=creep.attack(targ2)
            console.log(code)
            if (code == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(targ2) == ERR_NO_PATH)
					creep.moveTo(targ2, {ignoreDestructibleStructures: true})
            }
        }
        else if(targ){
            code=creep.attack(targ)
            console.log(code)
            if (code == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(targ) == ERR_NO_PATH)
					creep.moveTo(targ, { ignoreDestructibleStructures: true})
            }
        }
        else if (invadeRoom != 'undefined') {
            creep.moveTo(Game.flags.Attack, {reusePath:3}); //new
        	/*if(creep.pos.roomName != invadeRoom) 
			{
				var exitDir = Game.map.findExit(creep.room.name, invadeRoom);
				var Exit = creep.pos.findClosestByRange(exitDir);
				creep.moveTo(Exit), [{reusePath: 3}];
			}*/
        }
		//else creep.moveTo(flag);
			
    
    }
};