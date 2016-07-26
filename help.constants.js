/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.constants');
 * mod.thing == 'a thing'; // true
 */
function Const() {};
Const.DEBUG_ALL = false;

Const.MAX_HARVESTERS     = 5;
Const.MAX_UPGRADERS      = 2;
Const.MAX_BUILDERS       = 0;
Const.MAX_REPAIRERS      = 1;
Const.MAX_WALLREPAIRERS  = 1;
Const.MAX_SOLDATS        = 0;
Const.MAX_HEALERS        = 0;
Const.MAX_REMOTES        = 0;
Const.MAX_SCOUTS         = 0;
Const.MAX_AMBASSADORS    = 0;

Const.PERCENT_HARVESTERS     = 0.5;
Const.PERCENT_UPGRADERS      = 0.2;
Const.PERCENT_BUILDERS       = 0.2;
Const.PERCENT_REPAIRERS      = 0.1;
Const.PERCENT_WALLREPAIRERS  = 0.1;
Const.PERCENT_SOLDATS        = 0.0;
Const.PERCENT_HEALERS        = 0.0;
Const.PERCENT_REMOTES        = 0;
Const.PERCENT_SCOUTS         = 0;
Const.PERCENT_AMBASSADORS    = 0;

module.exports = Const;