/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('help.constants');
 * mod.thing == 'a thing'; // true
 */
function Const() {};
Const.MAX_HARVESTERS     = 4;
Const.MAX_UPGRADERS      = 5;
Const.MAX_BUILDERS       = 5; 
Const.MAX_REPAIRERS      = 1;
Const.MAX_WALLREPAIRERS  = 1;
Const.MAX_SOLDATS        = 1;
Const.MAX_HEALERS        = 0;
Const.MAX_REMOTES        = 0;
Const.MAX_SCOUTS         = 0;
Const.MAX_AMBASSADORS    = 0;
Const.MAX_MINERS         = 2;
 
Const.ZOMBIE_TICK            = 150;

Const.CPU_TRACK_TICKS = 100;

Const.DEBUG_ALL              = false;
Const.HEADER_FREQUENCY       = 3;

Const.COMPRESS               = false;
Const.TRANSITION_COMP        = false;

Const.TOWER_REPAIR_DELAY     = 13;
Const.TOWER_REPAIR_THRESHOLD = .50;

Const.LINK_RUN_DELAY         = 5;
Const.LINK_SEND_THRESHOLD    = .40;

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
Const.PERCENT_MINERS         = 0;

module.exports = Const;