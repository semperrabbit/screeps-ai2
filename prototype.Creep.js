

module.exports = function() {

    Creep.prototype.moveToHomeRoom = function(){
        homeRoomName = creep.memory.homeRoom;

        if(_.isEqual(this.pos.roomName, homeRoomName)){
            this.memory.imHome=true;
            return OK;
        }else{
            if(Game.flags[homeRoomName])
                this.moveTo(Game.flags[homeRoomName]);
            else
                try{
                    this.moveTo(new RoomPosition(25, 25, Game.rooms[homeRoomName]));
                }catch(e){
                    console.log('Cannot move '+this.name+' to homeroom')
                }
        }
    }
    Creep.prototype.moveToSourceRoom = function(){
        sourcePos = Utils.getObjectPosById(this.memory.source);
        sourceRoomName = sourcePos.roomName;

        if(_.isEqual(this.pos.roomName, sourceRoomName)){
            return OK;
        }else{
            if(Game.flags[sourceRoomName])
                this.moveTo(Game.flags[sourceRoomName]);
            else
                try{
                    this.moveTo(new RoomPosition(25, 25, Game.rooms[sourceRoomName]));
                }catch(e){
                    console.log('Cannot move '+this.name+' to sourceRoomName')
                }
        }
    }
    Creep.prototype.moveToTargetRoom = function(){
        sourcePos = Utils.getObjectPosById(this.memory.source);
        sourceRoomName = sourcePos.roomName;

        if(_.isEqual(this.pos.roomName, sourceRoomName)){
            return OK;
        }else{
            if(Game.flags[sourceRoomName])
                this.moveTo(Game.flags[sourceRoomName]);
            else
                try{
                    this.moveTo(new RoomPosition(25, 25, Game.rooms[sourceRoomName]));
                }catch(e){
                    console.log('Cannot move '+this.name+' to sourceRoomName')
                }
        }
    }



    //rewrites the moveTo function that doesn't include options to include a set of options you choose
    //  NOTE: this function will automatically replace any existing usage you have in your code.
    // simply add require('prototype.Creep')(); to the beginning the module you want to use this in
//    let oldMoveTo = Creep.prototype.moveTo
    Creep.prototype.goto = function(arg1, arg2, arg3){
        if (!this.my) {return ERR_NOT_OWNER;}
        if (this.spawning) {return ERR_BUSY;}
        if (this.fatigue > 0) {return ERR_TIRED;}
        if (this.getActiveBodyparts(C.MOVE) == 0) {return ERR_NO_BODYPART;}
        
        if(arg1 instanceof Object) {
            oldOpt = arg2;
            newOpt = {reusePath: 5, ignoreCreeps:true};
            if(!oldOpt) return this.moveTo(arg1, newOpt);


        }
    }
//    Creep.prototype.oldMoveTo = oldMoveTo;//
};
