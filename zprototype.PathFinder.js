/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('zprototype.PathFinder');
 * mod.thing == 'a thing'; // true
 */

add=function(){};
add.saveSearchToMemory=function(){
    memItem=core.PathFinder.search.toString().split(/\r?\n/)
    Memory.pathfinder=memItem;
}


module.exports = function(){
    PathFinder = _.merge(PathFinder, add)
};