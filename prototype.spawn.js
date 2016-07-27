var Utils = require('help.functions');
module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var body = [];
//            if(roleName == 'harvester') {
//                body = Utils.getCreepAbilities(roleName, energy);
//            } else {
/*
                var numberOfMoveAndCarryParts = Math.floor(energy * 0.25); // MOR
                var numberOfWorkParts         = Math.floor(energy * 0.5);
                for (let i = 0; i < numberOfWorkParts-1; i++) {
                    body.push(WORK);
                }
                for (let i = 0; i < numberOfMoveAndCarryParts+1; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < numberOfMoveAndCarryParts; i++) {
                    body.push(MOVE);
                }
*/
//                body.push(WORK); body.push(WORK); 
                var numberOfParts = Math.floor(energy / 300);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                }
//            } 

            // create creep with the created body and the given role
//            console.log('Creating a ' + roleName + ' spawn with ' + energy + ' energy.')
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };
}

