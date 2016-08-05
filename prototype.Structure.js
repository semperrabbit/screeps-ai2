/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.Structure');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {
    // ADD MEMORY TO STRUCTURES
    Object.defineProperty(Structure.prototype, 'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory.structure)) {
                Memory.structure = {};
            }
            if(!_.isObject(Memory.structure)) {
                return undefined;
            }
            return Memory.structure[this.id] = Memory.structure[this.id] || undefined;
        },
        set: function(value) {
            if(_.isUndefined(Memory.structure)) {
                Memory.structure = {};
            }
            if(!_.isObject(Memory.structure)) {
                throw new Error('Could not set structure memory');
            }
            Memory.structure[this.id] = value;
        }
    });
};