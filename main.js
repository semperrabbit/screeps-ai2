// import modules
require('prototype.StructureSpawn')();
require('prototype.Creep')();

var Const = require('help.constants');
var Cache = require('help.cache');
var Utils = require('help.functions');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleSoldat = require('role.soldat');
var roleHealer = require('role.healer');
var roleRemote = require('role.remote');
//var roleScout = require('role.scout');
//var roleAmbassador = require('role.ambassador');

var structureTower = require('structure.tower');

module.exports.loop = function () {

//    memLen = RawMemory.get().length;
//    var compressedOutput = LZString.compressToUTF16(RawMemory.get());
//    console.log('uncompressed: '+memLen+'\t Compressed: '+compressedOutput.length);

//    console.log(Utils.getObjectPosById('577b93b80f9d51615fa48902'));

    var output = '';
    var cache = new Cache();

//    console.log('' + Utils.Base64.toNumber('Man'));

    Utils.garbageCollect();

    Utils.initRoomsInMemory();
    Utils.loadWallsInCache(cache);

    for(let room in Game.rooms) {

        //Run for each tower in my room, run the structure.tower module
        var towers = Game.rooms[room].find(FIND_MY_STRUCTURES,{filter: { structureType: STRUCTURE_TOWER}});
        for(let i in towers) {if(towers[i].my)structureTower.run(towers[i]);}

        var creeps = Memory.rooms[room].creepsInRoom;
        for (let i in creeps) {
            creep = Game.creeps[creeps[i]];
            var roleName = creep.memory.role;
            switch(roleName) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairer.run(creep);
                    break;
                case 'wallRepairer':
                    roleWallRepairer.run(creep, cache);
                    break;
                case 'soldat':
                    roleHarvester.run(creep);
                    break;
                case 'healer':
                    roleHealer.run(creep);
                    break;
                case 'scout':
                    //roleScout.run(creep);
                    break;
                case 'ambassador':
                    //roleAmbassador.run(creep);
                    break;
                case 'remote':
                    roleRemote.run(creep);
                    break;
                default:
                    Utils.createTypeDistribution(room, creep.memory.role);
                    break;
            }
        }
    }

	
	if(!(Game.time % Const.HEADER_FREQUENCY)) {
	       console.log('Room\tHarves\tUpgrad\tBuilde\tRepair\tWallRe\tSoldat\tHealer\tRemote\tScouts\tAmbass\tGoal %\tNext Death ttl/name/type\t');
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
            if (typeDistribution['harvester'].total < typeDistribution['harvester'].max) {
                output += 'Trying to build Harvester with ' + energy + ' energy';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        
                // if spawning failed and we have no harvesters left
                if (name == ERR_NOT_ENOUGH_ENERGY && typeDistribution['harvester'].total == 0) {
                    // spawn one with what is available
                    name = Game.spawns.Spawn1.createCustomCreep(
                        Game.spawns.Spawn1.room.energyAvailable, 'harvester');
                }
            }
            // if not enough upgraders
            else if (typeDistribution['upgrader'].total < typeDistribution['upgrader'].max) {
                output += 'Trying to build Upgrader';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
            }
            // if not enough repairers
            else if (typeDistribution['repairer'].total < typeDistribution['repairer'].max) {
                output += 'Trying to build Repairer';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
            }
            // if not enough builders
            else if (typeDistribution['builder'].total < typeDistribution['builder'].max) {
                output += 'Trying to build Builder';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
            }
            // if not enough wallRepairers
            else if (typeDistribution['wallRepairer'].total < typeDistribution['wallRepairer'].max) {
                output += 'Trying to build WallUpgrader';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
            }
            else if (typeDistribution['soldat'].total < typeDistribution['soldat'].max) {
                output += 'Trying to build Soldat';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'soldat');
            }
            else if (typeDistribution['healer'].total < typeDistribution['healer'].max) {
                output += 'Trying to build Healer';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'healer');
            }
            else if (typeDistribution['remote'].total < typeDistribution['remote'].max) {
                output += 'Trying to build Remote';
                // try to spawn one
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'remote');
            }
            else {
                // else try to spawn a builder
        //        name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
            }
        }

        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (name > 0) {
            console.log("Spawned new creep: " + name);
        }

    }
//    output = RawMemory.get();
//    var compressedOutput = LZString.compressToUTF16(RawMemory.get());
//    console.log(compressedOutput);
    console.log(output);
};