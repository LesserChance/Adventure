define(['jquery','sprite'], function($,Sprite) {
    var Entity = Class.extend({
        init: function(game,id){
            this._game=game;
            this._tileX=0;
            this._tileY=0;

            this._id = id;
            this._sprite = null;
            this._flipSpriteX = false;
            this._flipSpriteY = false;
        },
        setPosition: function(x,y){
            this.pointDown();
            this._tileX=x;
            this._tileY=y;
            this.renderSprite();
        },
        setSprite: function(name){
            this._sprite=new Sprite(name,this._game,this);
            this.renderSprite();
        },
        renderSprite: function(){
            if(this._sprite._ready){
                if(!this._sprite._currentAnimation){this.setAnimation("walk_down",120);}
                this._game._renderer.drawEntity(this);
            }else{
                var self=this;
                setTimeout(function(){
                    self.renderSprite();
                },100);
            }
        },
        setAnimation: function(name, speed, count, onEndCount) {
            this._sprite.setAnimation(name, speed, count, onEndCount);
        },
        startAnimation: function() {
            this._sprite.startAnimation();
        },
        stopAnimation: function() {
            this._sprite.stopAnimation();
        },
        resetAnimation: function() {
            this._sprite.resetAnimation();
        },
        idle:function(){

        }
    });
    
    return Entity;
});