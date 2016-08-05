// import modules
require('prototype.Creep')();
require('prototype.Source')();
require('prototype.Structure')();
require('prototype.StructureSpawn')();

var Cache = require('help.cache');
var Const = require('help.constants');
var Init  = require('help.initialization');
var Utils = require('help.functions');


var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleSoldat = require('role.soldat');
var roleHealer = require('role.healer');
var roleRemote = require('role.remote');
var roleMiner = require('role.eminer');
//var roleAmbassador = require('role.ambassador');

var structureTower = require('structure.tower');
var structureLink  = require('structure.link');
module.exports.loop = function () {
//    console.log('Start Decomp:      ' +Game.cpu.getUsed());
    Utils.decompressMemory();
    Utils.garbageCollect();

    Init.sourcesInMemory();
    Utils.initRoomsInMemory();

    var output = '';
    var cache = new Cache();

    Utils.loadWallsInCache(cache);

    Utils.cpuLog('initDone');

    for(let room in Game.rooms) {

        //Run for each tower in my room, run the structure.tower module
        var towers = Game.rooms[room].find(FIND_MY_STRUCTURES,{filter: { structureType: STRUCTURE_TOWER}});
        for(let i in towers) {if(towers[i].my)structureTower.run(towers[i], cache);}

        structureLink.run(Game.rooms[room], cache);

        var creepNames = Memory.rooms[room].creepsInRoom;
        for (let name of creepNames) {
            creep = Game.creeps[name];
            if(parseInt(Math.random()*10000));
            Utils.runZombie(creep);
            var roleName = creep.memory.role;
            switch(roleName) {
                case 'harvester':
                    roleHarvester.run(creep, cache);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep, cache);
                    break;
                case 'builder':
                    roleBuilder.run(creep, cache);
                    break;
                case 'repairer':
                    roleRepairer.run(creep, cache);
                    break;
                case 'wallRepairer':
                    roleWallRepairer.run(creep, cache);
                    break;
                case 'soldat':
                    roleHarvester.run(creep, cache);
                    break;
                case 'healer':
                    roleHealer.run(creep, cache);
                    break;
                case 'scout':
                    //roleScout.run(creep, cache);
                    break;
                case 'ambassador':
                    //roleAmbassador.run(creep, cache);
                    break;
                case 'remote':
                    roleRemote.run(creep, cache);
                    break;
                case 'miner':
                    roleMiner.run(creep, cache);
                    break;
                default:
                    if(_.isUndefined(Memory.rooms[room].types[roleName]))
                        Utils.createTypeDistribution(room, roleName);
                    break;
            }
        }
    }

    Utils.cpuLog('roomLoopDone');

	
	if(!(Game.time % Const.HEADER_FREQUENCY)) {
	       output += 'Room\tHarves\tUpgrad\tBuilde\tRepair\tWallRe\tSoldat\tHealer\tRemote\tScouts\tAmbass\tGoal %\tNext Death ttl/name/type\t';
	}
    for(let room in Game.rooms) {
        if(Game.rooms.length > 1) {
            output+='\n'
        }
        var roomObject = Game.rooms[room];
        var energy = roomObject.energyCapacityAvailable;
        var name = 0;
        var typeDistribution = Memory.rooms[room].types;
        var currTotal = 0;
        var total = 0;
        var nextDeath = Utils.getNextExpectedDeathInRoom(room);

        for(let types in typeDistribution) {
            currTotal += typeDistribution[types].total;
            total     += typeDistribution[types].max;
        }

        if(output != ''){output += '\n';}
        output += 
            room + '\t' +
            typeDistribution['harvester'].total    + '/' + Const.MAX_HARVESTERS     + '\t' +
            typeDistribution['upgrader'].total     + '/' + Const.MAX_UPGRADERS      + '\t' +
            typeDistribution['builder'].total      + '/' + Const.MAX_BUILDERS       + '\t' + 
            typeDistribution['repairer'].total     + '/' + Const.MAX_REPAIRERS      + '\t' +
            typeDistribution['wallRepairer'].total + '/' + Const.MAX_WALLREPAIRERS  + '\t' +
            typeDistribution['soldat'].total       + '/' + Const.MAX_SOLDATS        + '\t' +
            typeDistribution['healer'].total       + '/' + Const.MAX_HEALERS        + '\t' +
            typeDistribution['remote'].total       + '/' + Const.MAX_REMOTES        + '\t' +
            typeDistribution['scout'].total        + '/' + Const.MAX_SCOUTS         + '\t' +
            typeDistribution['ambassador'].total   + '/' + Const.MAX_AMBASSADORS    + '\t' +
            parseInt(currTotal/total*10000)/100.0 + '%' + '\t' + nextDeath.ttl      + ' / ' +
            nextDeath.name + ' / ' + nextDeath.role + '\t';
    
        // if not enough harvesters
        for(let type in typeDistribution){
           
        }

        if(Game.rooms[room].controller.my){
            Game.spawns.Spawn1.createMiner(energy, 'miner');
            switch(true){
                case (typeDistribution['harvester'].total < typeDistribution['harvester'].max) :
                    output += 'Trying to build Harvester with ' + energy + ' energy';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
            
                    // if spawning failed and we have no harvesters left
                    if (name == ERR_NOT_ENOUGH_ENERGY && typeDistribution['harvester'].total == 0) {
                        // spawn one with what is available
                        name = Game.spawns.Spawn1.createCustomCreep(
                            Game.spawns.Spawn1.room.energyAvailable, 'harvester');
                    }
                    break;
                // if not enough upgraders
                case (typeDistribution['upgrader'].total < typeDistribution['upgrader'].max):
                    output += 'Trying to build Upgrader';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader', cache);
                    break;
                // if not enough repairers
                case (typeDistribution['repairer'].total < typeDistribution['repairer'].max):
                    output += 'Trying to build Repairer';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer', cache);
                    break;
                // if not enough builders
                case (typeDistribution['builder'].total < typeDistribution['builder'].max):
                    output += 'Trying to build Builder';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder', cache);
                    break;
                // if not enough wallRepairers
                case (typeDistribution['wallRepairer'].total < typeDistribution['wallRepairer'].max):
                    output += 'Trying to build WallUpgrader';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer', cache);
                    break;
                case (typeDistribution['soldat'].total < typeDistribution['soldat'].max):
                    output += 'Trying to build Soldat';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'soldat', cache);
                    break;
                case (typeDistribution['healer'].total < typeDistribution['healer'].max):
                    output += 'Trying to build Healer';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'healer', cache);
                    break;
                case (typeDistribution['remote'].total < typeDistribution['remote'].max):
                    output += 'Trying to build Remote';
                    // try to spawn one
                    name = Game.spawns.Spawn1.createCustomCreep(energy, 'remote', cache);
                    break;
                default:
                    // else try to spawn a builder
            //        name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
                    break;
            }
        }

    Utils.cpuLog('spawnDone');

//console.log(name);
        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (name > 0) {
            console.log("Spawned new creep: " + name);
        }
        switch(true){
            case (name==ERR_NOT_ENOUGH_ENERGY)://	-6	The spawn and its extensions contain not enough energy to create a creep with the given body.
                output += ': Not enough energy';
                break;
            case (name==ERR_BUSY)://	-4	The spawn is already in process of spawning another creep.
                output += ': Spawn is busy';
                break;
//            case ():
//ERR_NOT_OWNER	-1	You are not the owner of this spawn.
//ERR_NAME_EXISTS	-3	There is a creep with the same name already.
//ERR_INVALID_ARGS	-10	Body is not properly described.
//ERR_RCL_NOT_ENOUGH	-14	Your Room Controller level is not enough to use this spawn.
            default:
        }

    }
//    output = RawMemory.get();
//    var compressedOutput = LZString.compressToUTF16(RawMemory.get());
//    console.log(compressedOutput);

    Utils.compressMemory();

    Utils.cpuLog('end');
    output+='\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCPU: '+Memory.cpuLog[Game.time];
    console.log(output);
};