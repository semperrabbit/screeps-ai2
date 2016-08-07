require('prototype.Source')();
require('prototype.Structure')();

var Cache = require('help.cache');
var Utils = require('help.functions');


module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName, roomName, cache) {
        if(this.spawning != null) return ERR_BUSY;

        var body = [];
        var options = {};//{role: undefined, working, homeRoom, target, roomTransition, rtIndex};
        switch(roleName) {
            case 'remote':
                body = getBalancedBody(energy);
    
                var energySource = undefined;

                for(room in Memory.rooms) {
                    if(Memory.rooms[room] == this.room.name) { continue; }
                    energySource = Memory.rooms[room].energyDeposits[0];
    
                    if(!(energySource === undefined)) { break; }
                }
    
                if(energySource == undefined) { return ERR_NOT_FOUND;}
    
                var energySourcePos = Utils.getObjectPosById(energySource.id);
                var searchReturn   = PathFinder.search(this.pos, {pos: energySourcePos, range: 1});
                var path = searchReturn.path;
                var roomTransition = [];
    
                for(let i = 0; i < path.length; i++) {
                    if(i == 0){continue;}

                    if(path[i-1].roomName != path[i].roomName) {
                        // document transition point
                        roomTransition.push({dst: path[i-1], src: path[i]} );
                    }
                }
                // create creep with the created body and the given role
               options = {
                    role:   roleName,        working:        false,         homeRoom: this.room.name,
                    target: energySource.id, roomTransition: roomTransition, rtIndex:  0
                };
    
                break;
            case 'soldat':
                // create a balanced body as big as possible with the given energy
                body = getSoldatBody(energy, cache.get('swat'));
                options = { role: roleName, working: false };
                break;
            case 'claimer':
                if(Memory.hasClaimer)return -1;
                var numberOfPartsC = Math.floor(energy / 650);
                if (numberOfPartsC >= 11) {numberOfParts = 10} else {var numberOfParts = numberOfPartsC;}
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CLAIM);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                }
                options.state='exit';
                options.role='claimer';
                Memory.hasClaimer=true;
                break;
            default:
                // create a balanced body as big as possible with the given energy
//                if(cache.get(this.room.name+'_usingStorage') == true) {
//                    body = getBalancedCarryOnlyBody();
//                } else {
                    body = getBalancedBody(energy);
//                }
    
                // create creep with the created body and the given role
                options = { role: roleName, working: false };
                break;
        }

        if(! options.homeRoom)
            options.homeRoom = roomName;
        if(! options.homeRoom)
            options.homeRoom = this.room.name;

        var sourceId    = undefined;
        var sourceCount = 50;
        var sourceList;
        
        if(Game.rooms[roomName])
            sourceList = Game.rooms[roomName].find(FIND_SOURCES);
        else
            sourceList = this.room.find(FIND_SOURCES);

        for(source of sourceList){
            if(!_.isUndefined(Memory.sources[source.id]) && source.memory.total < sourceCount){
                sourceId = source.id;
                sourceCount = source.memory.total;
            }
        }


        options = _.merge(options, {source: sourceId,});
        ret =  this.createCreep(body, undefined, options);
        return ret;
    }

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createMiner = function(energy, roleName, roomName, cache) {
        if(_.isUndefined(Game.rooms[roomName]))throw('Room '+roomName+' doesnt exist')
        if(_.isUndefined(this.memory.lastSpawnForDifferentRoom))
            this.memory.lastSpawnForDifferentRoom = (this.room.name != roomName);

        switch(this.memory.lastSpawnForDifferentRoom){
            case true:
                if(this.room.name != roomName)
                    return -20;
                else
                    this.memory.lastSpawnForDifferentRoom = false;
                break;
            case false:
                if(this.room.name != roomName)
                    this.memory.lastSpawnForDifferentRoom = true;
                break;
        }

        if(this.room.name != roomName && Game.rooms[roomName] && Game.rooms[roomName].controller.level > 3)
            return -20;


//            roomName = this.room.name;
console.log('Running miner spawn for '+roomName)        
        var targetSource = undefined;
        for(sourceName in Memory.rooms[roomName].sources){
console.log(sourceName+' has miner: '+Memory.sources[sourceName].hasMiner)
            if(!_.isUndefined(Memory.sources[sourceName].hasMiner) && !Memory.sources[sourceName].hasMiner){
                targetSource = sourceName;
console.log(targetSource+ ' needs miner')
                break;
            }
        }
        
        if(!targetSource) return 'no source in room '+roomName+ ' needs a miner' 

        // create a balanced body as big as possible with the given energy
        var numberOfPartsC = Math.floor(energy / 100);
        var body = [];
        if (numberOfPartsC >= 23) {numberOfParts = 22;} else {var numberOfParts = numberOfPartsC;}
        for (let i = 0; i < numberOfParts-1; i++) {
            body.push(WORK);
        }
        if(body.length){
            body.push(MOVE);
            body.push(MOVE);
        }

        if(energy<=300 || !body.length)body=[WORK,WORK,MOVE,MOVE];

        // create creep with the created body and the given role

console.log('createMinerCreep('+body+', undefined, {role: '+roleName+', source: '+targetSource+', homeRoom: '+Utils.getObjectPosById(targetSource).roomName+')');
        return this.createCreep(body, undefined, { role: roleName, source: targetSource,
                                homeRoom: Utils.getObjectPosById(targetSource).roomName });
    };
    StructureSpawn = _.merge(StructureSpawn, AddToSpawn);
}
var AddToSpawn = function(){};
AddToSpawn.getSpawnFor = function (energy, roomObject) {
    if(typeof roomObject == 'string')roomObject = Game.rooms[roomObject];
    var targetSpawn = undefined;
    switch (roomObject){
    case null:
    case undefined:
        for (spawnName in Game.spawns) {
            var spawnObject = Game.spawns[spawnName];
            if (spawnObject.spawning == null && spawnObject.room.energyAvailable >= energy) {
                return (spawnObject);

            }
        }
        return (-1);
        break;
    default:
        var SpawnR = roomObject.find(FIND_MY_SPAWNS)     
        for (spawnObject of SpawnR) {
            if (spawnObject.spawning == null && spawnObject.room.energyAvailable >= energy) {
                return (spawnObject);
            }
        }
        return (-1);
        break;
    }
};
AddToSpawn.getReadySpawn = AddToSpawn.getSpawnFor;

var getBalancedBody = function(energy){
    // create a balanced body as big as possible with the given energy
    var numberOfParts = Math.floor(energy / 250);
    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }
    return body;
}
var getBalancedCarryOnlyBody = function(energy){
    // create a balanced body as big as possible with the given energy
    var numberOfParts = Math.floor(energy / 275);
    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }
    return body;
}
var getSoldatBody = function(energy, swat){
    // create a balanced body as big as possible with the given energy
    var body = [];
    switch (swat){
        case true:
            var numberOfParts = Math.floor(energy / 150);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(ATTACK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            body.push(MOVE);
            break;
        default:
            var numberOfParts = Math.floor(energy / 200);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(TOUGH);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(TOUGH);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(ATTACK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            body.push(MOVE);
            break;
    }
    return body;
}
