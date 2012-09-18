define(['jquery','character'], function($,Character) {
    var Player = Character.extend({
        init: function(game){
            this._super(game,"player");
            this.setSprite("player");
        },
        setPosition: function(x,y){
            this.pointDown();
            this._tileX=x;
            this._tileY=y;
            this.renderSprite();
            this._game.updateMap();
        },
        moveLeft: function(){
            this._keepWalkingCallback=this.moveLeft;
            if(!this._walking){
                this.pointLeft();
                if(this._game.checkPosition(this._tileY,this._tileX-1)){
                    this.walkTo(this._tileX-1,this._tileY);
                }else{
                    this.killWalking();
                }
            }
        },
        moveUp: function(){
            this._keepWalkingCallback=this.moveUp;
            if(!this._walking){
                this.pointUp();
                if(this._game.checkPosition(this._tileY-1,this._tileX)){
                    this.walkTo(this._tileX,this._tileY-1);
                }else{
                    this.killWalking();
                }
            }
        },
        moveRight: function(){
            this._keepWalkingCallback=this.moveRight;
            if(!this._walking){
                this.pointRight();
                if(this._game.checkPosition(this._tileY,this._tileX+1)){
                    this.walkTo(this._tileX+1,this._tileY);
                }else{
                    this.killWalking();
                }
            }
        },
        moveDown: function(){
            this._keepWalkingCallback=this.moveDown;
            if(!this._walking){
                this.pointDown();
                if(this._game.checkPosition(this._tileY+1,this._tileX)){
                    this.walkTo(this._tileX,this._tileY+1);
                }else{
                    this.killWalking();
                }
            }
        },
        walkTo: function(x,y){
            this._continueWalking=true;
            this._walking=true;
            var xDistance=(x-this._tileX)*this._game._level._scaledTileWidth;
            var yDistance=(y-this._tileY)*this._game._level._scaledTileWidth;
            var speed=(this._game._level._scaledTileWidth)/12;
            
            if(xDistance!=0){
                this.stopAnimation();
                this.startAnimation();
                this.walkX(xDistance,speed*((xDistance<0)?-1:1),null,x)
            }else if(yDistance!=0){
                this.stopAnimation();
                this.startAnimation();
                this.walkY(yDistance,speed*((yDistance<0)?-1:1),null,y)
            }else{
                this.killWalking();
            }
        },
        walkX: function(fullDistance,speed,distance,finalX){
            if(distance==null){distance=fullDistance;}
            if(distance!=0){
                this._game.updateMap(-(fullDistance-distance),0);
                var self=this;
                setTimeout(function(){
                    self.walkX(fullDistance,speed,distance-speed,finalX);
                },10);
            }else{
                this._walking=false;
                this._tileX=finalX;
                this._game.updateMap(0,0);
                if(this._continueWalking){
                    this._keepWalkingCallback.call(this);
                }else{
                    this.killWalking();
                }
            }
        },
        walkY: function(fullDistance,speed,distance,finalY){
            if(distance==null){distance=fullDistance;}
            if(distance!=0){
                this._game.updateMap(0,-(fullDistance-distance));
                var self=this;
                setTimeout(function(){
                    self.walkY(fullDistance,speed,distance-speed,finalY);
                },10);
            }else{
                this._walking=false;
                this._tileY=finalY;
                this._game.updateMap(0,0);
                if(this._continueWalking){
                    this._keepWalkingCallback.call(this);
                }else{
                    this.killWalking();
                }
            }
        },
        stopWalking: function(){
            this._continueWalking=false;
        },
        killWalking: function(){
            this.stopWalking();
            this._walking=false;
            this.stopAnimation();
        }
    });

    return Player;
});