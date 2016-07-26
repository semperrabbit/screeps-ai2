module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomRemoteCreep =
        function(energy, roleName) {
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

            var energySource = undefined;


            for(room in Memory.rooms) {
                if(Memory.rooms[room] == currentRoom) {
                    continue;
                }
                energySource = Memory.rooms[room].energyDeposits[0];
            }

            if(energySource == undefined) { return ERR_NOT_FOUND;}

            var energySourcePos = new RoomPosition(energySource.x, energySource.y, energySource.roomName);
            console.log(energySourcePos);

            var pathToSource = PathFinder.search(
                this.pos, energySourcePos ,
                {
                  // We need to set the defaults costs higher so that we
                  // can set the road cost lower in `roomCallback`
                  plainCost: 2,
                  swampCost: 6,
            	  
                  roomCallback: function(roomName) {
            
                    let room = Game.rooms[roomName];
                    // In this example `room` will always exist, but since PathFinder 
                    // supports searches which span multiple rooms you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
            
                    room.find(FIND_STRUCTURES).forEach(function(structure) {
                            if (structure.structureType === STRUCTURE_ROAD) {
                            // Favor roads over plain tiles
                            costs.set(structure.pos.x, structure.pos.y, 1);
                        } else if (structure.structureType !== STRUCTURE_CONTAINER && 
                                 (structure.structureType !== STRUCTURE_RAMPART ||
                                  !structure.my)) {
                            // Can't walk through non-walkable buildings
                            costs.set(structure.pos.x, structure.pos.y, 0xff);
                        }
                    });
            
                    // Avoid creeps in the room
                    room.find(FIND_CREEPS).forEach(function(creep) {
                      costs.set(creep.pos.x, creep.pos.y, 0xff);
                    });
            
                    return costs;
                  },
                });

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false, homeRoom: this.room.name, source: energySourcePos, route: pathToSource.path, routeIndex: 0});
        };
};

