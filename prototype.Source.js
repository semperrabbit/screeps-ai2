/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.Source');
 * mod.thing == 'a thing'; // true
 */

//var getObjectPosById=require('help.functions').getObjectPosById;

module.exports = function(){
    Object.defineProperty(Source.prototype, 'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory.sources)) {
                Memory.sources = {};
            }
            if(!_.isObject(Memory.sources)) {
                return undefined;
            }
            return Memory.sources[this.id] = Memory.sources[this.id] || undefined;
        },
        set: function(value) {
            if(_.isUndefined(Memory.sources)) {
                Memory.sources = {};
            }
            if(!_.isObject(Memory.sources)) {
                throw new Error('Could not set source memory');
            }
            Memory.sources[this.id] = value;
        }
    });
};