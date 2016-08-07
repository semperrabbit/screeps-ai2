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

Utils.reportDuration = function(methodName, cpuUsed){
    if(_.isUndefined(Memory.cpuLog)) Memory.cpuLog={};
    for(let tick in Memory.cpuLog){
        if(tick <= Game.time - Const.CPU_TRACK_TICKS)
            delete Memory.cpuLog[tick];
    }
    if(_.isUndefined(Memory.cpuLog[Game.time]))Memory.cpuLog[Game.time]=[];
    Memory.cpuLog[Game.time].push({method: methodName, usage: cpuUsed})
}

Utils.getDuration = function(methodName, tick){
    if(!tick) tick = Game.time;
    if(_.isUndefined(Memory.cpuLog[tick])) return;
    var ret;
    for(logEntry of Memory.cpuLog[tick]){
console.log(logEntry.method)
        if( logEntry.method == methodName ){
            ret=logEntry;
            break;
        }
    }

    if(ret)
        return ret.usage;
    else
        return;
}

Utils.posEquals = function(pos1, pos2){return pos1.x == pos2.x && pos1.y == pos2.y && pos1.roomName == pos2.roomName;};

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
//console.log(creep.name+' moving to storage');
            creep.moveTo(source);
        }
    }
}

//Utils.getCpuLog = function(){

Utils.runZombie = function(creep, force){
    
    if(creep.memory.role=='miner')return;
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

