define(['jquery','entity'], function($,Entity) {
    var Character = Entity.extend({
        init: function(game,id){
            this._super(game,id);
        },
        moveLeft: function(){
            this.pointLeft();
            this._tileX--;
        },
        moveUp: function(){
            this.pointUp();
            this._tileY--;
        },
        moveRight: function(){
            this.pointRight();
            this._tileX++;
        },
        moveDown: function(){
            this.pointDown();
            this._tileY++;
        },
        pointLeft: function(){
            this.setAnimation("walk_left",100);
            this._game._renderer.drawEntity(this);
        },
        pointUp: function(){
            this.setAnimation("walk_up",100);
            this._game._renderer.drawEntity(this);
        },
        pointRight: function(){
            this.setAnimation("walk_right",100);
            this._game._renderer.drawEntity(this);
        },
        pointDown: function(){
            this.setAnimation("walk_down",120);
            this._game._renderer.drawEntity(this);
        }
    });
    
    return Character;
});