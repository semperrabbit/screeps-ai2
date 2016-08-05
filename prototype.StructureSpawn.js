require('prototype.Source')();

var Cache = require('help.cache');
var Utils = require('help.functions');
module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName, cache) {
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
                body = getSoldatBody(energy);
                options = { role: roleName, working: false };
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

        switch(true){
            case (energy <= 200 ):
                body = [WORK, CARRY, MOVE];                         console.log(200); break;
            case (energy <= 250 ):
                body = [WORK, CARRY, MOVE, MOVE];                   console.log(250); break;
            case (energy <= 300 ):
                body = [WORK, CARRY, MOVE, MOVE];                   console.log(300); break;
            case (energy <= 350):
                body = [WORK, WORK, CARRY, MOVE, MOVE];             console.log(350); break;
            case (energy <= 400):
                body = [WORK, WORK, CARRY, MOVE, MOVE];             console.log(400); break;
//            case (energy <= 450):
//                body = [WORK, WORK, WORK, CARRY, MOVE, MOVE];       console.log(450); break;
//            case (energy <= 500):
//                body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; console.log(500); break;
//            case (this.room.energyCapacityAvailable <= 550):
//                body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; console.log(550); break;
        }

        var sourceId    = undefined;
        var sourceCount = 50;
        var sourceList  = this.room.find(FIND_SOURCES);

        for(source of sourceList){
            if(!_.isUndefined(Memory.sources[source.id]) && source.memory.total < sourceCount){
                sourceId = source.id;
                sourceCount = source.memory.total;
            }
        }

        options = _.merge(options, {source: sourceId});
        ret =  this.createCreep(body, undefined, options);
        return ret;
    }

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createMiner = function(energy, roleName, cache) {
        var targetSource = undefined;
        for(sourceName in Memory.rooms[this.room.name].sources){
            if(!Memory.sources[sourceName].hasMiner){
                targetSource = sourceName;
                break;
            }
        }
        
        if(!targetSource) return -20;

        // create a balanced body as big as possible with the given energy
        var numberOfPartsC = Math.floor(energy / 100);
        var body = [];
        if (numberOfPartsC >= 23) {numberOfParts = 22;} else {var numberOfParts = numberOfPartsC;}
        for (let i = 0; i < numberOfParts-1; i++) {
            body.push(WORK);
        }
        body.push(MOVE);
        body.push(MOVE);

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: roleName, source: targetSource });
    };
}

var getBalancedBody = function(energy){
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

var getSoldatBody = function(energy){
    // create a balanced body as big as possible with the given energy
    var body = [];
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
    return body;
}
