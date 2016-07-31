var Utils = require('help.functions');
module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        var body = [];
        var options = {};
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
                    source: energySource.id, roomTransition: roomTransition, rtIndex:  0,
                    dir:    '+'
                };
    
                break;
            case 'soldat':
                // create a balanced body as big as possible with the given energy
                body = getSoldatBody(energy);
                options = { role: roleName, working: false };
                break;
            default:
                // create a balanced body as big as possible with the given energy
                body = getBalancedBody(energy);
    
                // create creep with the created body and the given role
                options = { role: roleName, working: false };
                break;
        }

        ret =  this.createCreep(body, undefined, options);
        return ret;
    }
}

var getBalancedBody = function(energy){
    // create a balanced body as big as possible with the given energy
    var numberOfParts = Math.floor(energy / 300);
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
