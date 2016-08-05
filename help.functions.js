/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.functions');
 * mod.thing == 'a thing'; // true
 */
require('prototype.Source')()
require('prototype.Structure')()

var Const = require('help.constants');
var Cache = require('help.cache');
var LZString = require('help.LZString');

function Utils() {};


Utils.posEquals = function(pos1, pos2){};

Utils.harvest = function(creep, cache) {


// If upgrader, look for a roomController link and try to pull from it.
    if(creep.memory.role == 'upgrader') {
        var link = cache.get(creep.room.name+'_ControllerLink');
        if(!_.isUndefined(Memory.rooms[creep.room.name].links.controllerLink)){
            link = Game.getObjectById(Memory.rooms[creep.room.name].links.controllerLink);
        }
        if(link) {
            var code = creep.withdraw(link, RESOURCE_ENERGY);
            switch(code) {
                case ERR_FULL:
                case OK:               creep.memory.working = true; break;
                case ERR_NOT_IN_RANGE: creep.moveTo(link); break;
            }
        }
    }
    
//Look for a valid source. If not pulled from memory, get closest
    var sourceType = 'source';
    var hasSource = (!_.isUndefined(creep.memory.source));
    if(hasSource)
        source = Game.getObjectById(creep.memory.source);
    else
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);//, {filter: function(s){s.energy > 0}});


//Look for filled container or storage. Tries to pull from memory, if not, get closest
/*
get storage from memory.

get closest storage

get store

if memory is empty ,
*/
    var store = undefined;
    if(hasSource && !_.isUndefined(Memory.sources[creep.memory.source].container)){
        store = Game.getObjectById(Memory.sources[creep.memory.source].container);
    }else{
        store=creep.pos.findClosestByRange(Utils.findStructuresByType(creep.room, STRUCTURE_CONTAINER));
    }

    if( creep.room.storage && (creep.room.storage.store[RESOURCE_ENERGY] / creep.room.storage.storeCapacity) > .1)   
        store=creep.room.storage;
    

//console.log(creep.name+' '+store.store[RESOURCE_ENERGY] +' '+ store.storageCapacity);
    if( store && (store.store[RESOURCE_ENERGY] / store.storeCapacity) > .1) {source = store; sourceType='storage'}
    // try to harvest energy, if the source is not in range

    if(sourceType == 'source'){ 
//console.log(source)
        if (creep.harvest(source)  == ERR_NOT_IN_RANGE) {
            // move towards the source
//console.log(creep.name+' moving to source');
            creep.moveTo(source);
        }
    }
    if(sourceType == 'storage'){
//console.log(storage)
        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // move towards the storage
console.log(creep.name+' moving to storage');
            creep.moveTo(source);
        }
    }
}
Utils.cpuLog = function(checkpoint){
    if(_.isUndefined(Memory.cpuLog)) Memory.cpuLog={};

    for(let tick in Memory.cpuLog){
        if(tick <= Game.time - 10)
            delete Memory.cpuLog[tick];
    }

    var used = Utils.cpu();
    switch(checkpoint) {
        case null:
        case undefined:
        default:
            Memory.cpuLog[Game.time] = used;
            break;
//            if(!_.isUndefined(Memory.cpuLog[Game.time])) != 'object') {
//console.log('new Memory.cpuLog['+Game.time+']')
//                Memory.cpuLog[Game.time] = {};
//            }
//            Memory.cpuLog[Game.time][checkpoint] = used;
    }
    return used;
}

//Utils.getCpuLog = function(){

Utils.runZombie = function(creep, force){
    var ttl = creep.ticksToLive;

    if(force==true)ttl=0;

    if(ttl < Const.ZOMBIE_TICK && creep.memory.role != 'zombie')
    {
        var closestSpawn = creep.pos.findClosestByRange(Game.spawns) || Game.spawns.Spawn1;
        creep.memory.role   = 'zombie';
        creep.memory.target = closestSpawn.id;
    }// else if(creep.ticksToLive > 100 || creep.memory.rolename != 'zombie'){
//        return ERR_INVALID_TARGET;
//    }
    if(creep.memory.role != 'zombie')return; 
    if(creep.carry.energy > 0) {
        // if it has energy, deposit like a harvester until empty
        creep.memory.role='harvester';
        creep.memory.working=true;
        return;
    }
    
    var target = Game.getObjectById(creep.memory.target);
    var code = target.recycleCreep(creep);
    switch(code){
        case ERR_NOT_IN_RANGE: //ERR_NOT_IN_RANGE   -9 The target creep is too far away.
            creep.moveTo(target, {reusePath: 100});
            break;

//        case ERR_NOT_OWNER:      //ERR_NOT_OWNER     -1 You are not the owner of this spawn or the target creep.
//        case ERR_INVALID_TARGET: //ERR_INVALID_TARGET -7 The specified target object is not a creep.
//        case OK:                 //OK             0 The operation has been scheduled successfully.
        default:
            return code;
    }
    
    return OK;
}

Utils.cpu = function(){return parseInt(Game.cpu.getUsed()*10000)/10000.0}

Utils.getNextExpectedDeathInRoom = function(room) {
	var ret = {name: '', ttl: 10000, role: ''}
	var creeps = Memory.rooms[room].creepsInRoom;
	for(creep of creeps) {
		if(Game.creeps[creep].ticksToLive < ret.ttl)
		    ret = {name: Game.creeps[creep].name,
		           ttl:  Game.creeps[creep].ticksToLive,
		           role: Memory.creeps[creep].role};
    }
	return ret;	
};


Utils.pickupNearbyEnergy = function(creep) {
    var drop = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0];
    if(drop && (creep.carry.energy != creep.energyCapacity)) {
//        creep.say(drop)
//        creep.moveTo(drop);
        creep.pickup(drop);
    }
} 

Utils.findHarvestSource = function(){
    
}

Utils.getObjectPosById = function(id) {
    var pos = Game.getObjectById(id);
    if(!(pos == null || pos == undefined)) {return pos.pos}
    
    for(let r in Memory.rooms) {
        if(!_.isUndefined(Memory.rooms[r].energyDeposits)) {
            for(let i in Memory.rooms[r].energyDeposits) {
                var test = Memory.rooms[r].energyDeposits[i];
                if(test.id == id) {
                    return new RoomPosition(test.x, test.y, test.roomName);
                };
            }
        }
        if(!_.isUndefined(Memory.rooms[r].mineralDeposits)) {
            for(let i in Memory.rooms[r].mineralDeposits) {
                var test = Memory.rooms[r].mineralDeposits[i];
                if(test.id == id) {
                    return new RoomPosition(test.x, test.y, test.roomName);
                };
        }
    }
    }
    return undefined;
}
 
Utils.findStructuresByType = function(room, types) {
    var ret = [];
    if(!_.isArray(types)) types = [types];
    for(let type of types) {
        var find_ = FIND_MY_STRUCTURES;
        if(type == STRUCTURE_WALL      || type == STRUCTURE_ROAD  ||
           type == STRUCTURE_CONTAINER || type == STRUCTURE_PORTAL) find_ = FIND_STRUCTURES;
        var structList = room.find(find_, {filter: { structureType: type }});
        if(structList && structList.length>0)
            for (let struct of structList) {
//                if(_.isUndefined(struct.memory.ignore))
                    ret.push(struct);
            }
    }
    return ret;
}

Utils.loadWallsInCache = function(cache) {
    var walls = [];
    var wallList = [];
    for(let room in Game.rooms) {
        if(Memory.rooms[room].isMine == true) {
//            walls = Utils.findStructuresByType(Game.rooms[room], [STRUCTURE_WALL, STRUCTURE_RAMPART]);
//            walls = [];
            wallList = Game.rooms[room].find(FIND_STRUCTURES,
                {filter: function(s){return s.structureType==STRUCTURE_WALL &&
                (s.pos.x != 0) && (s.pos.y !=0) && (s.pos.x != 49) && (s.pos.y !=49) }});
            for(let wall of wallList){walls.push(wall);}
            wallList = Game.rooms[room].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_RAMPART}});
            for(let wall of wallList){walls.push(wall);}
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
    	if(!cache.get(room+'_walls')) {cache.set(room+'_walls', walls);}
        walls = [];
    }
}

Utils.initRoomsInMemory = function() {

    if(_.isUndefined(Memory.rooms)) {
        console.log('Memory.rooms doesnt exist')
        Memory.rooms = {};
    }
    for(let room in Game.rooms) {
        if(_.isUndefined(Memory.rooms[room])) {
            console.log('Memory.rooms[ ' + room + '] doesnt exist')
            Memory.rooms[room] = {};
        }
        if(_.isUndefined(Memory.rooms[room].types))
            Memory.rooms[room].types = {};

//        if(Memory.rooms[room].types['harvester'] == undefined)
        Memory.rooms[room].types['harvester']    = {
			total: 0, goalPercentage: Const.PERCENT_HARVESTERS,
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
        Memory.rooms[room].types['zombie']   = {
			total: 0,
			goalPercentage: 0,
			currentPercentage: 0,
			max: 0,
			minExtensions: 0
		}

//		for(let type in Memory.rooms[currRoom].types){Memory.rooms[currRoom].types[type].total=0};

        Memory.rooms[room].isMine     = false;
        if(Game.rooms[room].find(FIND_MY_STRUCTURES)) {Memory.rooms[room].isMine = true;}

        Memory.rooms[room].hasThreats = false;
        var threats = [];
        for(struc of Game.rooms[room].find(FIND_HOSTILE_STRUCTURES)){ threats.push(struc); }
        for(struc of Game.rooms[room].find(FIND_HOSTILE_CREEPS))    { threats.push(struc); }
        if(threats.length > 0) {Memory.rooms[room].hasThreats = true;}

        Memory.rooms[room].creepsInRoom = [];
        for(var creep in Game.creeps) {
            var currRoom = Game.creeps[creep].pos.roomName;
            var currRole = Game.creeps[creep].memory.role;

            if(currRole == 'remote') {
                Memory.rooms[Game.creeps[creep].memory.homeRoom].types[currRole].total++;
                Memory.rooms[Game.creeps[creep].memory.homeRoom].creepsInRoom.push(creep);
            } else if (! _.has(Memory.rooms[currRoom].types, currRole)){
                Utils.createTypeDistribution(currRoom, currRole);
                Memory.rooms[currRoom].types[currRole].total++;
                Memory.rooms[currRoom].creepsInRoom.push(creep);
            } else if(creep != 0 || _.has(Memory.rooms[currRoom].types, currRole)){
//                console.log(creep);
//                console.log(''+currRole);
                Memory.rooms[currRoom].types[currRole].total++;
                Memory.rooms[currRoom].creepsInRoom.push(creep);
            }
        }

        if(_.isUndefined(Memory.rooms[room].sources)){
            Memory.rooms[room].sources = {};
            var sourceList = Game.rooms[room].find(FIND_SOURCES);
            for (let i in sourceList) {
                Memory.rooms[room].sources[sourceList[i].id]=sourceList[i].pos;
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
Utils.populationGoalsMet = function(room) {
	if(!Memory.rooms[room].isMine)return true;
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
Utils.createTypeDistribution = function(room, type) {
console.log('Adding type: '+type+' to room: '+room);
	Memory.rooms[room].types[type] = {total: 0,	goalPercentage: 0.1,
	    currentPercentage: 0, max: 5, minExtensions: 2};
};
Utils.compress   = function(str){return LZString.compressToUTF16    (str);}
Utils.compressMemory = function() {
    if(Const.COMPRESS){
console.log('Compress Start:  ' +Game.cpu.getUsed());
        if(!_.isUndefined(Memory.rooms)) {
            Memory.compressedRooms = Utils.compress(JSON.stringify(Memory.rooms));
            if(!Const.TRANSITION_COMP)delete Memory.rooms;
        }
        if(!_.isUndefined(Memory.sources)) {
            Memory.compressedSources = Utils.compress(JSON.stringify(Memory.sources));
            if(!Const.TRANSITION_COMP)delete Memory.sources;
        }
console.log('Compress End:    ' +Game.cpu.getUsed());
    }
}
Utils.decompress = function(str){return LZString.decompressFromUTF16(str);}
Utils.decompressMemory = function() {
    if(Const.COMPRESS && !(_.isUndefined(Memory.compressedRooms))) {
console.log('Decompress End: ' +Game.cpu.getUsed());
        Memory.rooms = JSON.parse(Utils.decompress(Memory.compressedRooms));
        delete Memory.compressedRooms;
    }
    if(Const.COMPRESS && !(_.isUndefined(Memory.compressedSources))) {
        Memory.sources = JSON.parse(Utils.decompress(Memory.compressedSources));
        delete Memory.compressedSources;
console.log('Decompress End:  ' +Game.cpu.getUsed());
    }
}
Utils.fromBase64 = function(number) {// Used from http://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
    if (isNaN(Number(number)) || number === null || number === Number.POSITIVE_INFINITY) throw "The input is not valid";
    if (number < 0) throw "Can't represent negative numbers now";
    var rixit; 
    var residual = Math.floor(number);
    var result = '';
    while (true) {
        rixit = residual % 64
        result = _Rixits.charAt(rixit) + result;
        residual = Math.floor(residual / 64);
        if (residual == 0) break;
    }
    return result;
}
Utils.toBase64 = function(rixits) {// Used from http://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
    var result = 0;
    rixits = rixits.split('');
    for (var e = 0; e < rixits.length; e++) { result = (result * 64) + _Rixits.indexOf(rixits[e]); }
    return result;
}
var _Rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";// Used from http://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript

module.exports = Utils;

