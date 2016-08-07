/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.initialization');
 * mod.thing == 'a thing'; // true
 */
var Const = require('help.constants');
var Utils = require('help.functions');
function Init() {};

Init.roomsInMemory = function() {

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

        if(!_.isUndefined(Memory.rooms[room].types.undefined))
            delete Memory.rooms[room].types.undefined;


//        if(Memory.rooms[room].types['harvester'] == undefined)
        Memory.rooms[room].types['claimer']    = {
			total: 0, goalPercentage: Const.PERCENT_HARVESTERS,
			currentPercentage: 0,
			max: 0,
			minExtensions: 0
		}
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
//        if(Memory.rooms[room].types['miner'] == undefined)
        Memory.rooms[room].types['miner']     = {
			total: 0,
			goalPercentage: Const.PERCENT_MINERS,
			currentPercentage: 0,
			max: Const.MAX_MINERS,
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
            var currRoom = Game.creeps[creep].memory.homeRoom || Game.creeps[creep].pos.roomName;
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
Init.sourcesInMemory = function(){
    if(_.isUndefined(Memory.sources))
        Memory.sources={};

    for(roomName in Game.rooms){
        var currRoom = Game.rooms[roomName];
        var sourceList = currRoom.find(FIND_SOURCES);
        for (let currSource of sourceList) {
            var id = currSource.id;
            if(_.isUndefined(Memory.sources[id]))
                Memory.sources[id] = {total: 0, names: []};
            Memory.sources[id].total=0;
            Memory.sources[id].names=[];

            if(_.isUndefined(Memory.sources[id].container)) {
                var containerList = currSource.pos.findInRange(FIND_STRUCTURES, 1, {filter: (c)=>c.structureType==STRUCTURE_CONTAINER});
                if(containerList && containerList.length > 0)
                    Memory.sources[id].container = containerList[0].id;
            }
            var miner = [];
            for(roomName in Game.rooms)
            {
                miners = Game.rooms[roomName].find(FIND_MY_CREEPS, {filter: function(c){return c.memory.source==id && c.memory.role=='miner'}});
                for(m of miners){
                    miner.push(m);
                }
            }
            if(miner.length)// if theres more than 0
                Memory.sources[id].hasMiner=true;
            else
                Memory.sources[id].hasMiner=false;
            if(miner.length && miner[0].ticksToLive < Const.ZOMBIE_TICK)
                Memory.sources[id].hasMiner=false;
        }
    }
    for(creepName in Game.creeps){
        var currCreep = Game.creeps[creepName];
        if(_.isUndefined(currCreep.memory.source) || currCreep.memory.source=={}) continue;
        var id=currCreep.memory.source;
        Memory.sources[id].names.push(currCreep.name);
        Memory.sources[id].total++;
    }
}
Init.loadWallsInCache = function(cache) {
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

module.exports = Init;