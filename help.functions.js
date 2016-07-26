/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.functions');
 * mod.thing == 'a thing'; // true
 */
var Const = require('help.constants');
var Cache = require('help.cache');

function Utils() {};

Utils.loadWallsInCache = function(cache) {
    var walls = [];
    var wallList = [];
    for(let room in Game.rooms) {
        if(Memory.rooms[room].isMine == true) {
            wallList = Game.rooms[room].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL   }});
            for(let i in wallList){walls.push(wallList[i]);}
            wallList = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_RAMPART}});
            for(let i in wallList){walls.push(wallList[i]);}
        }
        if(Memory.globalCacheTick == Game.tick) {
        	if(!cache.get(room+'_walls')) {
        		cache.set(room+'_walls', walls);
        	}
        }
        walls = [];
    }
}

Utils.initRoomsInMemory = function() {
    if(Memory.rooms === undefined) {
        console.log('Memory.rooms doesnt exist')
        Memory.rooms = {};
    }
    for(let room in Game.rooms) {
        if(Memory.rooms[room] === undefined) {
            console.log('Memory.rooms[ ' + room + '] doesnt exist')
            Memory.rooms[room] = {};
        }
        Memory.rooms[room].types = {};
        Memory.rooms[room].types['harvester']    = {
			total: 0,
			goalPercentage: Const.PERCENT_HARVESTERS,
			currentPercentage: 0,
			max: Const.MAX_HARVESTERS,
			minExtensions: 0
		}
        Memory.rooms[room].types['upgrader']     = {
			total: 0,
			goalPercentage: Const.PERCENT_UPGRADERS,
			currentPercentage: 0,
			max: Const.MAX_UPGRADERS,
			minExtensions: 0,
		}
        Memory.rooms[room].types['builder']      = {
			total: 0,
			goalPercentage: Const.PERCENT_BUILDERS,
			currentPercentage: 0,
			max: Const.MAX_BUILDERS,
			minExtensions: 0
		}
        Memory.rooms[room].types['repairer']     = {
			total: 0,
			goalPercentage: Const.PERCENT_REPAIRERS,
			currentPercentage: 0,
			max: Const.MAX_REPAIRERS,
			minExtensions: 0
		}
        Memory.rooms[room].types['wallRepairer'] = {
			total: 0,
			goalPercentage: Const.PERCENT_WALLREPAIRERS,
			currentPercentage: 0,
			max: Const.MAX_WALLREPAIRERS,
			minExtensions: 0
		}
        Memory.rooms[room].types['soldat']       = {
			total: 0,
			goalPercentage: Const.PERCENT_SOLDATS,
			currentPercentage: 0,
			max: Const.MAX_SOLDATS,
			minExtensions: 0
		}
        Memory.rooms[room].types['healer']       = {
			total: 0,
			goalPercentage: Const.PERCENT_HEALERS,
			currentPercentage: 0,
			max: Const.MAX_HEALERS,
			minExtensions: 0
		}
        Memory.rooms[room].types['scout']        = {
			total: 0,
			goalPercentage: Const.PERCENT_SCOUTS,
			currentPercentage: 0,
			max: Const.MAX_SCOUTS,
			minExtensions: 0
		
        }
        Memory.rooms[room].types['remote']      = {
			total: 0,
			goalPercentage: Const.PERCENT_REMOTESS,
			currentPercentage: 0,
			max: Const.MAX_REMOTES,
			minExtensions: 0
		
        }
        Memory.rooms[room].types['ambassador']   = {
			total: 0,
			goalPercentage: Const.PERCENT_AMBASSADORS,
			currentPercentage: 0,
			max: Const.MAX_AMBASSADORS,
			minExtensions: 0
		}
        Memory.rooms[room].types['deconstructor']   = {
			total: 0,
			goalPercentage: Const.PERCENT_AMBASSADORS,
			currentPercentage: 0,
			max: Const.MAX_AMBASSADORS,
			minExtensions: 0
		}
        Memory.rooms[room].isMine     = false;
        if(Game.rooms[room].find(FIND_MY_STRUCTURES)) {Memory.rooms[room].isMine = true;}

        Memory.rooms[room].hasThreats = false;
        if(Game.rooms[room].find(FIND_HOSTILE_STRUCTURES) || Game.rooms[room].find(FIND_HOSTILE_CREEPS)) {Memory.rooms[room].isMine = true;}

        Memory.rooms[room].creepsInRoom = [];
        for(var creep in Game.creeps) {
            var currRoom = Game.creeps[creep].pos.roomName;
            var currRole = Memory.creeps[creep].role;
            if(creep != 0 || currRole != unknown){
                Memory.rooms[currRoom].types[currRole].total++;
                Memory.rooms[currRoom].creepsInRoom.push(creep);
            }
        }

        Memory.rooms[room].energyDeposits = [];
        var energyDeposits = Game.rooms[room].find(FIND_SOURCES);
        for(let i in energyDeposits) {
            Memory.rooms[room].energyDeposits.push(energyDeposits[i].pos);
        }

        Memory.rooms[room].mineralDeposits = [];
        var mineralDeposits = Game.rooms[room].find(FIND_MINERALS);
        for(let i in mineralDeposits) {
            Memory.rooms[room].mineralDeposits.push(mineralDeposits[i].pos);
            Memory.rooms[room].mineralDeposits[i].type = mineralDeposits[i].mineralType;
        }
    }
}

Utils.findSources = function() {
    
}

Utils.debug = function(message) {
    if(Const.DEBUG_ALL)
        console.log(message);
}

Utils.routeCreep = function(creep,dest) {


    if(creep.fatigue>0){
        return -1;
    }
    if(typeof dest == "undefined"){
        return -1;
    }

    var locStr = creep.room.name+"."+creep.pos.x+"."+creep.pos.y;

    var path = false;

    if(typeof Memory.routeCache !== "object"){
         Memory.routeCache = {};
    }

    if(typeof Memory.routeCache[locStr] === "undefined"){

        Memory.routeCache[locStr] = {'dests':{},'established':Game.time}
    }

    if(typeof Memory.routeCache[locStr]['dests'][''+dest.id] === "undefined"){    
        Memory.routeCache[locStr]['dests'][dest.id] = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
        path = creep.room.findPath(creep.pos,dest.pos,{maxOps:500,heuristicWeight:2})
        if(typeof path[0] !== "undefined"){


        Memory.routeCache[locStr]['dests'][''+dest.id][path[0].direction]+=1;

        for(var i =0;i<path.length-1;i++){
            var step = path[i];
            var stepStr = creep.room.name+"."+step.x+"."+step.y//creep.room.name+"."+step.x+"."+step.y
            if(typeof Memory.routeCache[stepStr] === "undefined"){
                Memory.routeCache[stepStr] = {'dests':{},'established':Game.time,'usefreq':0.0};
            }
            if(typeof Memory.routeCache[stepStr]['dests'][''+dest.id] === "undefined"){
               Memory.routeCache[stepStr]['dests'][''+dest.id] = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
            }
            Memory.routeCache[stepStr]['dests'][''+dest.id][path[i+1].direction]+=1;

        }
    }
    else{

        dir = Math.floor(Math.random()*8);


        var error = creep.move(dir);
        return error;

    }
//}

    for(var k in Memory.routeCache[locStr]['dests']){
        if(Game.getObjectById(k)==null){//clean out invalid routes
            delete  Memory.routeCache[locStr]['dests'][k];
            //console.log("Pruned",k)
        }
    }


    var total = 0.0//pick from the weighted list of steps
    for(var d in Memory.routeCache[locStr]['dests'][''+dest.id]){
        total+=Memory.routeCache[locStr]['dests'][''+dest.id][d];
        }
    }
    var total=total*Math.random();

    var dir = 0;
    for(var d in Memory.routeCache[locStr]['dests'][''+dest.id]){
        total-=Memory.routeCache[locStr]['dests'][''+dest.id][d];
        if(total<0){
            dir = d;
            break;
        }

    }

    if(creep.pos.getRangeTo(dest)>1 && pathisBlocked(creep.pos,dir)){ //you will need your own "pathisBlocked" function!
        dir = Math.floor(Math.random()*8);
    }


    var error = creep.move(dir);
     return error;

}
Utils.pathisBlocked = function(pos, dir){

    // If at the edge of the room, if it is not an exit to another room, return true
    if(pos.x ==  0 && (dir == BOTTOM_LEFT  || dir == LEFT   || dir == TOP_LEFT))     {
        if(true) {
            return true;
        }
    }
    if(pos.x == 49 && (dir == BOTTOM_RIGHT || dir == RIGHT  || dir == TOP_RIGHT))    {return true;}
    if(pos.y ==  0 && (dir == TOP_LEFT     || dir == TOP    || dir == TOP_RIGHT))    {return true;}
    if(pos.y == 49 && (dir == BOTTOM_LEFT  || dir == BOTTOM || dir == BOTTOM_RIGHT)) {return true;}

    var ret = false;
    var newPos = new RoomObject(pos.x, pos.y, pos.roomName);
    ;

    return ret;
};

Utils.findStructuresByType = function(types) {
    var ret = [];
//    Game.structures
    for(let struc in Game.structures) {
        for (let type in types) {
//            if(Game.structures[struc] typeof type) {
                ret.push(struc);
//            }
        }
    }
    
    return ret;
}

Utils.garbageCollect = function() {
// check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    
}
Utils.goalsMet = function() {
	for(var n in Const.typeDistribution) {
		var type = Const.typeDistribution[n];
//		Const.debug('population', 'goal for type ' + n +' == ' + type.currentPercentage +' < '+(type.goalPercentage - type.goalPercentage/4) +' && '+type.total < type.max) || type.total == 0  || type.total < type.max*0.75);
		if((type.currentPercentage < (type.goalPercentage - type.goalPercentage/4) && type.total < type.max) || type.total == 0  || type.total < type.max*0.75) {
			return false;
		}
	}
// +'  '+ 
	return true;
};

Utils.getMaxPopulation = function() {
	var population = 0;
	var oneRoom = false;
	for(let room in Game.rooms) {
		var typeDistribution = Memory.rooms[room].types;
		if(oneRoom){return population}
		oneRoom = true;
		for(var n in typeDistribution) {
			population += typeDistribution[n].max;
		}
	}
	return population;
};
Utils.getNextExpectedDeathInRoom = function(room) {
	var ttl = 100000;
	var creeps = Memory.rooms[room].creepsInRoom;
	for(var i = 0; i < creeps.length; i++) {
		var creep = Game.creeps[creeps[i]];

		if(creep.ticksToLive < ttl) {
			ttl = creep.ticksToLive;
		}
	}
	return ttl;	
};
Utils.createTypeDistribution = function(room, type) {
	Memory.rooms[room].types[type] = {
		total: 0,
		goalPercentage: 0.1,
		currentPercentage: 0,
		max: 5,
		minExtensions: 2
	};
};

//Only harvester configured correctly
Utils.getCreepAbilities = function(creepType, energy) {
    var abilities = [];
	switch(creepType) {
    	case 'harvester':
    		if       (energy >= 1000) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else if(energy >= 900) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
//    		} else if(energy >= 900) {
//    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else if(energy >= 800) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else if(energy >= 750) {
       			abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else if(energy >= 700) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else if(energy >= 600) {
    			abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else if(energy >= 500) {
    			abilities = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else if(energy >= 400) {
    			abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else if(energy >= 350) {
    			abilities = [WORK, WORK, CARRY, MOVE, MOVE];
    		} else if(energy >= 300) {
    			abilities = [WORK, WORK, CARRY, MOVE];
    		} else if(energy >= 200) {
    			abilities = [WORK, CARRY, MOVE];
    		}
    	break;
    	case 'CreepBuilder':
    		if(energy <= 1) {
    			abilities = [WORK, CARRY, MOVE];
    		} else
    		if(energy <= 2) {
    			abilities = [WORK, CARRY, CARRY, MOVE];
    		} else
    		if(energy <= 3) {
    			abilities = [WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 4) {
    			abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 5) {
    			abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 6) {
    			abilities = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 7) {
    			abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 8) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 9) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else
    		if(energy >= 10) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		}
    	break;
    	case 'CreepUpgrader':
    		if(energy <= 1) {
    			abilities = [WORK, CARRY, MOVE];
    		} else
    		if(energy <= 2) {
    			abilities = [WORK, CARRY, CARRY, MOVE];
    		} else
    		if(energy <= 3) {
    			abilities = [WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 4) {
    			abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 5) {
    			abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 6) {
    			abilities = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 7) {
    			abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 8) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 9) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		} else
    		if(energy >= 10) {
    			abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    		}
    	break;
    	case 'CreepCarrier':
    		if(energy <= 1) {
    			abilities = [CARRY, MOVE];
    		} else
    		if(energy <= 2) {
    			abilities = [CARRY, CARRY, MOVE];
    		} else
    		if(energy <= 3) {
    			abilities = [CARRY, CARRY, MOVE, MOVE];
    		} else
    		if(energy <= 4) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 5) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 6) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 7) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 8) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy <= 9) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    		} else
    		if(energy >= 10) {
    			abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
    		}
    	break;
    	case 'CreepSoldier':
    		if(energy <= 1) {
    			abilities = [TOUGH, ATTACK, MOVE];
    		} else
    		if(energy <= 2) {
    			abilities = [TOUGH, MOVE, ATTACK, MOVE];
    		} else
    		if(energy <= 3) {
    			abilities = [TOUGH, MOVE, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 4) {
    			abilities = [TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 5) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 6) {
    			abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 7) {
    			abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 8) {
    			abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy <= 9) {
    			abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		} else
    		if(energy >= 10) {
    			abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE];
    		}
    	break;
    	case 'CreepShooter':
    		if(energy <= 5) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		} else
    		if(energy <= 6) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		} else
    		if(energy <= 7) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		} else
    		if(energy <= 8) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		} else
    		if(energy <= 9) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		} else
    		if(energy >= 10) {
    			abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE];
    		}
    	break;
    	case 'CreepScout':
    		abilities = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    	break;
    	case 'CreepHealer':
    		abilities = [MOVE, MOVE, MOVE, HEAL, MOVE];
    	break;
    }
    return abilities;
};


module.exports = Utils;