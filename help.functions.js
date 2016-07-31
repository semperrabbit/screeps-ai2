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
var LZString = require('help.LZString');

function Utils() {};

Utils.compress   = function(str){return LZString.compressToUTF16    (str);}
Utils.decompress = function(str){return LZString.decompressFromUTF16(str);}
Utils.pickupNearbyEnergy = function(creep) {
    let droppedEnergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
    if(droppedEnergy.length > 0) {creep.pickup(droppedEnergy);}
}

Utils.findHarvestSource = function(){
    
}

Utils.getObjectPosById = function(id) {
    var pos = Game.getObjectById(id);
    if(!(pos == null || pos == undefined)) {return pos.pos}
    
    for(let r in Memory.rooms) {
        for(let i in Memory.rooms[r].energyDeposits) {
            var test = Memory.rooms[r].energyDeposits[i];
            if(test.id == id) {
                return new RoomPosition(test.x, test.y, test.roomName);
            };
        }
        for(let i in Memory.rooms[room].mineralDeposits) {
            var test = Memory.rooms[room].mineralDeposits[i];
            if(test.id == id) {
                return new RoomPosition(test.x, test.y, test.roomName);
            };
        }
    }
    return undefined;
}

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
        walls.sort(function(a,b){
                if(a.structureType == b.structureType){ return a.hits-b.hits;}
                if(a.structureType == STRUCTURE_RAMPART && b.structureType == STRUCTURE_WALL){
                    if(a.hits != a.hitsMax && a.hits < b.hits) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                if(a.structureType == STRUCTURE_WALL && b.structureType == STRUCTURE_RAMPART){
                    if(b.hits != b.hitsMax && a.hits > b.hits) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                return 0;
            }
        );

    	if(!cache.get(room+'_walls')) {
    		cache.set(room+'_walls', walls);
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
        if(Memory.rooms[room] === undefined)
            Memory.rooms[room].types = {};

        
//        if(Memory.rooms[room].types['harvester'] == undefined)
        Memory.rooms[room].types['harvester']    = {
			total: 0,
			goalPercentage: Const.PERCENT_HARVESTERS,
			currentPercentage: 0,
			max: Const.MAX_HARVESTERS,
			minExtensions: 0
		}

//        if(Memory.rooms[room].types['upgrader'] == undefined)
        Memory.rooms[room].types['upgrader']     = {
			total: 0,
			goalPercentage: Const.PERCENT_UPGRADERS,
			currentPercentage: 0,
			max: Const.MAX_UPGRADERS,
			minExtensions: 0,
		}
//        if(Memory.rooms[room].types['builder'] == undefined)
        Memory.rooms[room].types['builder']      = {
			total: 0,
			goalPercentage: Const.PERCENT_BUILDERS,
			currentPercentage: 0,
			max: Const.MAX_BUILDERS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['repairer'] == undefined)
        Memory.rooms[room].types['repairer']     = {
			total: 0,
			goalPercentage: Const.PERCENT_REPAIRERS,
			currentPercentage: 0,
			max: Const.MAX_REPAIRERS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['wallRepairer'] == undefined)
        Memory.rooms[room].types['wallRepairer'] = {
			total: 0,
			goalPercentage: Const.PERCENT_WALLREPAIRERS,
			currentPercentage: 0,
			max: Const.MAX_WALLREPAIRERS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['soldat'] == undefined)
        Memory.rooms[room].types['soldat']       = {
			total: 0,
			goalPercentage: Const.PERCENT_SOLDATS,
			currentPercentage: 0,
			max: Const.MAX_SOLDATS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['healer'] == undefined)
        Memory.rooms[room].types['healer']       = {
			total: 0,
			goalPercentage: Const.PERCENT_HEALERS,
			currentPercentage: 0,
			max: Const.MAX_HEALERS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['scout'] == undefined)
        Memory.rooms[room].types['scout']        = {
			total: 0,
			goalPercentage: Const.PERCENT_SCOUTS,
			currentPercentage: 0,
			max: Const.MAX_SCOUTS,
			minExtensions: 0
		
        }
//        if(Memory.rooms[room].types['remote'] == undefined)
        Memory.rooms[room].types['remote']      = {
			total: 0,
			goalPercentage: Const.PERCENT_REMOTES,
			currentPercentage: 0,
			max: Const.MAX_REMOTES,
			minExtensions: 0
		
        }
//        if(Memory.rooms[room].types['ambassador'] == undefined)
        Memory.rooms[room].types['ambassador']   = {
			total: 0,
			goalPercentage: Const.PERCENT_AMBASSADORS,
			currentPercentage: 0,
			max: Const.MAX_AMBASSADORS,
			minExtensions: 0
		}
//        if(Memory.rooms[room].types['deconstructor'] == undefined)
        Memory.rooms[room].types['deconstructor']   = {
			total: 0,
			goalPercentage: Const.PERCENT_AMBASSADORS,
			currentPercentage: 0,
			max: Const.MAX_AMBASSADORS,
			minExtensions: 0
		}

/*        Memory.rooms[room].types['harvester'].max = Const.MAX_HARVESTERS;
        Memory.rooms[room].types['upgrader'].max = Const.MAX_UPGRADERS;
        Memory.rooms[room].types['builder'].max = Const.MAX_BUILDERS;
        Memory.rooms[room].types['repairer'].max = Const.MAX_REPAIRERS;
        Memory.rooms[room].types['wallRepairer'].max = Const.MAX_WALLREPAIRERS;
        Memory.rooms[room].types['soldat'].max = Const.MAX_SOLDATS;
        Memory.rooms[room].types['healer'].max = Const.MAX_HEALERS;
        Memory.rooms[room].types['scout'].max = Const.MAX_SCOUTS;
        Memory.rooms[room].types['remote'].max = Const.MAX_REMOTES;
        Memory.rooms[room].types['ambassador'].max = Const.MAX_AMBASSADORS;
        Memory.rooms[room].types['deconstructor'].max = Const.MAX_AMBASSADORS;
*/
        Memory.rooms[room].isMine     = false;
        if(Game.rooms[room].find(FIND_MY_STRUCTURES)) {Memory.rooms[room].isMine = true;}

        Memory.rooms[room].hasThreats = false;
        if(Game.rooms[room].find(FIND_HOSTILE_STRUCTURES) || Game.rooms[room].find(FIND_HOSTILE_CREEPS)) {Memory.rooms[room].hasThreats = true;}

        Memory.rooms[room].creepsInRoom = [];
        for(var creep in Game.creeps) {
            var currRoom = Game.creeps[creep].pos.roomName;
            var currRole = Game.creeps[creep].memory.role;

            if(currRole == 'remote') {
                Memory.rooms[Game.creeps[creep].memory.homeRoom].types[currRole].total++;
                Memory.rooms[Game.creeps[creep].memory.homeRoom].creepsInRoom.push(creep);
            } else if(creep != 0 || currRole != undefined){
//                console.log(creep);
//                console.log(''+currRole);
                Memory.rooms[currRoom].types[currRole].total++;
                Memory.rooms[currRoom].creepsInRoom.push(creep);
            }
        }

        Memory.rooms[room].energyDeposits = [];
        var energyDeposits = Game.rooms[room].find(FIND_SOURCES);
        for(let i in energyDeposits) {
            Memory.rooms[room].energyDeposits.push(     energyDeposits[i].pos);
            Memory.rooms[room].energyDeposits[i].id   = energyDeposits[i].id;
        }

        Memory.rooms[room].mineralDeposits = [];
        var mineralDeposits = Game.rooms[room].find(FIND_MINERALS);
        for(let i in mineralDeposits) {
            Memory.rooms[room].mineralDeposits.push(     mineralDeposits[i].pos);
            Memory.rooms[room].mineralDeposits[i].type = mineralDeposits[i].mineralType;
            Memory.rooms[room].mineralDeposits[i].id   = mineralDeposits[i].id;
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
            if(Game.structures[struc].structureType == type) {
                ret.push(struc);
            }
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

Utils.goalsMet = function(room) {
	var typeDistribution = Memory.rooms[room].types;
	for(var n in typeDistribution) {
		var type = typeDistribution[n];
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
	var roleName = '';
	var name = '';
	var creeps = Memory.rooms[room].creepsInRoom;
	for(var i = 0; i < creeps.length; i++) {
		var creep = Game.creeps[creeps[i]];

		if(creep.ticksToLive < ttl) {
		    roleName = creep.memory.role;
			ttl      = creep.ticksToLive;
			name     = creep.name;
		}
	}
	return {name: name, ttl: ttl, role: roleName};	
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

Utils.Base64 = {
// Used from http://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
    _Rixits :
//   0       8       16      24      32      40      48      56     63
//   v       v       v       v       v       v       v       v      v
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    // You have the freedom, here, to choose the glyphs you want for 
    // representing your base-64 numbers. The ASCII encoding guys usually
    // choose a set of glyphs beginning with ABCD..., but, looking at
    // your update #2, I deduce that you want glyphs beginning with 
    // 0123..., which is a fine choice and aligns the first ten numbers
    // in base 64 with the first ten numbers in decimal.

    // This cannot handle negative numbers and only works on the 
    //     integer part, discarding the fractional part.
    // Doing better means deciding on whether you're just representing
    // the subset of javascript numbers of twos-complement 32-bit integers 
    // or going with base-64 representations for the bit pattern of the
    // underlying IEEE floating-point number, or representing the mantissae
    // and exponents separately, or some other possibility. For now, bail
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "The input is not valid";
        if (number < 0)
            throw "Can't represent negative numbers now";

        var rixit; // like 'digit', only in some non-decimal radix 
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
            // console.log("rixit : " + rixit);
            // console.log("result before : " + result);
            result = this._Rixits.charAt(rixit) + result;
            // console.log("result after : " + result);
            // console.log("residual before : " + residual);
            residual = Math.floor(residual / 64);
            // console.log("residual after : " + residual);

            if (residual == 0)
                break;
            }
        return result;
    },

    toNumber : function(rixits) {
        var result = 0;
        // console.log("rixits : " + rixits);
        // console.log("rixits.split('') : " + rixits.split(''));
        rixits = rixits.split('');
        for (var e = 0; e < rixits.length; e++) {
            // console.log("_Rixits.indexOf(" + rixits[e] + ") : " + 
                // this._Rixits.indexOf(rixits[e]));
            // console.log("result before : " + result);
            result = (result * 64) + this._Rixits.indexOf(rixits[e]);
            // console.log("result after : " + result);
        }
        return result;
    }
}

module.exports = Utils;