 Room Manager
Get a list of my rooms

for each room, do {

create an array of targets in this room
create an array of damaged structures in this room
create an array of my creeps in this room
loan an array of my towers and structures in this room
load an array of spawns in this room
load an array of sources in this room

	if room contains a tower
		If tower energy > 0 then attack targets
		If tower energy > energycapacity/2 then repair damaged structures that are not walls or ramparts, closest by range
		If tower energy > energycapacity/3 then repair damaged ramparts by lowest hits
		If tower energy > energycapacity/4 then repair damaged walls by lowest hits


for each creep in this room do
 read role 
 send to appropriate role.module
}
------------------
 EMiners WWWWWM 550 \ WWWWWWWM 800 For {Game.spawns.Spawn1.room.energyCapacityAvailable - 50} / 100 Push W, then add an M
 
move to source
	mine source
	if full of energy then go to container and drop energy
	if container is full then go to structures and drop energy
 
------------------
 
 Workers WMC 200

If state is 'empty'
	move to dropped energy and pick up 
	move to container and fill
	if container empty move to source and mine
	if full change state to working
 
if state is 'working'
	build closest site
	repair damaged
	fill towers spawn and extensions
	upgrade controller
	if empty change state to empty

------------------

 Couriers MC 100

if state is 'empty'
	move to dropped energy and pick up 
	move to container and fill
	if full change state to working

if state is 'working'
	fill towers 
	fill spawn 
	fill extensions
	if empty change state to empty
	
------------------

Spawn Manager

for each room, count the sources, set Eminers = SourceCount
If averageavailableenergy is above 500, increase workers limit
set courier count = structures with energycapacity+3
 