// import modules
require('prototype.Creep')();
require('prototype.Source')();
require('prototype.Structure')();
require('prototype.StructureSpawn')();

var Cache = require('help.cache');
var Const = require('help.constants');
var Init  = require('help.initialization');
var Utils = require('help.functions');


var roleClaimer = require('role.claimer');
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
    var cache = new Cache();
    cache.set('swat', true);

    Init.sourcesInMemory();
    Init.roomsInMemory();
    Init.loadWallsInCache(cache);

    var output = '';


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
            creep.moveToHomeRoom();
            var roleName = creep.memory.role;
            switch(roleName) {
                case 'claimer':
                    roleClaimer.run(creep, cache);
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
                    roleSoldat.run(creep);
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


	
	if(!(Game.time % Const.HEADER_FREQUENCY)) {
	       output += 'Room\tHarves\tMiner\tUpgrad\tBuilde\tRepair\tWallRe\tSoldat\tHealer\tRemote\tScouts\tAmbass\tGoal %\tNext Death ttl/name/type\t';
	}
    for(let roomName in Game.rooms) {
        if(Game.rooms.length > 1) {
            output+='\n'
        }
        var roomObject = Game.rooms[roomName];
        var energy = roomObject.energyCapacityAvailable;
//console.log(roomObject.energyCapacityAvailable)
        if     (roomObject.energyCapacityAvailable <300)energy=500;
//        else if(roomObject.energyCapacityAvailable <500)energy=800;
        var spawn;
        if(roomObject.controller.level >=3)spawn = StructureSpawn.getSpawnFor(energy, roomObject);
        else                               spawn = StructureSpawn.getSpawnFor(energy);

        if(!spawn){
            spawns = roomObject.find(FIND_STRUCTURE, {filter: (s)=> s.structureType==STRUCTURE_SPAWN});
            if(spawns.length) spawn = spawns[0];
        }

        var name = 0;
        var typeDist = Memory.rooms[roomName].types;
        var currTotal = 0;
        var total = 0;
        var nextDeath = Utils.getNextExpectedDeathInRoom(roomName);

        for(let types in typeDist) {
            currTotal += typeDist[types].total;
            total     += typeDist[types].max;
        }

        if(output != ''){output += '\n';}
        output += 
            roomName + '\t' +
            typeDist['harvester'].total    + '/' + Const.MAX_HARVESTERS     + '\t' +
            typeDist['miner'].total        + '/' + Const.MAX_MINERS     + '\t' +
            typeDist['upgrader'].total     + '/' + Const.MAX_UPGRADERS      + '\t' +
            typeDist['builder'].total      + '/' + Const.MAX_BUILDERS       + '\t' + 
            typeDist['repairer'].total     + '/' + Const.MAX_REPAIRERS      + '\t' +
            typeDist['wallRepairer'].total + '/' + Const.MAX_WALLREPAIRERS  + '\t' +
            typeDist['soldat'].total       + '/' + Const.MAX_SOLDATS        + '\t' +
            typeDist['healer'].total       + '/' + Const.MAX_HEALERS        + '\t' +
            typeDist['remote'].total       + '/' + Const.MAX_REMOTES        + '\t' +
            typeDist['scout'].total        + '/' + Const.MAX_SCOUTS         + '\t' +
            typeDist['ambassador'].total   + '/' + Const.MAX_AMBASSADORS    + '\t' +
            parseInt(currTotal/total*10000)/100.0 + '%' + '\t' + nextDeath.ttl      + ' / ' +
            nextDeath.name + ' / ' + nextDeath.role + '\t';
    
        // if not enough harvesters
        for(let type in typeDist){
           
        }

        if(roomObject.controller.my){

            if(_.isUndefined(spawn.createCustomCreep) && typeDist['harvester'].total == 0)
            {
                name = StructureSpawn.getSpawnFor(roomObject.energyAvailable, roomName).createCustomCreep(
                    roomObject.energyAvailable, 'harvester', roomName);
                console.log("oh shit: "+roomName+' spawning '+name)

            
            }

            if(spawn && !(spawn<0)){
//                if(!_.isUndefined(Game.flags.NeedReserve) && StructureSpawn.getSpawnFor(650))
//                    StructureSpawn.getSpawnFor(650).createCustomCreep(energy, 'claimer', spawn.room.name, cache)

                switch(true){
                    case (_.isUndefined(spawn) || spawn == [] || spawn < 0):
                        break;
    
                    case (typeDist['harvester'].total < typeDist['harvester'].max) :
                        output += 'Trying to build Harvester with ' + energy + ' energy';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'harvester', roomName, cache);
                        break;
                    case (typeDist['miner'].total < typeDist['miner'].max && roomObject.memory.needsMiner) :
                        output += 'Trying to build Miner';
                        spawn.createMiner(energy, 'miner', roomName, cache);
                        break;
                    // if not enough upgraders
                    case (typeDist['upgrader'].total < typeDist['upgrader'].max):
                        output += 'Trying to build Upgrader';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'upgrader', roomName, cache);
                        break;
                    // if not enough repairers
                    case (typeDist['repairer'].total < typeDist['repairer'].max):
                        output += 'Trying to build Repairer';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'repairer', roomName, cache);
                        break;
                    // if not enough builders
                    case (typeDist['builder'].total < typeDist['builder'].max):
                        output += 'Trying to build Builder';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'builder', roomName, cache);
                        break;
                    // if not enough wallRepairers
                    case (typeDist['wallRepairer'].total < typeDist['wallRepairer'].max):
                        output += 'Trying to build WallUpgrader';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'wallRepairer', roomName, cache);
                        break;
                    case (typeDist['soldat'].total < typeDist['soldat'].max):
                        output += 'Trying to build Soldat';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'soldat', roomName, cache);
                        break;
                    case (typeDist['healer'].total < typeDist['healer'].max):
                        output += 'Trying to build Healer';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'healer', roomName, cache);
                        break;
                    case (typeDist['remote'].total < typeDist['remote'].max):
                        output += 'Trying to build Remote';
                        // try to spawn one
                        name = spawn.createCustomCreep(energy, 'remote', roomName , cache);
                        break;
                    default:
                        // else try to spawn a builder
                //        name = spawn.createCustomCreep(energy, 'wallRepairer');
                        break;
                }
            }
        }


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

//    Utils.cpuLog('end');
    Utils.reportDuration('total', Utils.cpu());
    output+='\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCPU: '+Utils.getDuration('total', null);
    console.log(output);
};

function doGameLoopMethod(theMethod){
    var cpuNow = Game.cpu.getUsed();
    try{
        theMethod();
    }catch (err){
        if(!isNullOrUndefined(err))
        {
            Game.notify("Error in main loop logic: \n" + err + "\n On line " + err.lineNumber);
            log("Error in main loop logic\n" +err + "\n" + err.stack, "error");
        }
    }
    var cpuSpend = Game.cpu.getUsed() - cpuNow;
    Utils.reportDuration(theMethod.name, cpuSpend);
}