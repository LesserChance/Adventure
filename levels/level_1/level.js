define(['jquery','level'], function($,Level) {
    var Level_1 = Level.extend({
        init: function(game){
            this._super(game);

            //pull necessary resources for this level
            this._tileWidth=48;
            this._rows=game._width/this._tileWidth;
            this._cols=game._height/this._tileWidth;
            this._scale=1;
            this._scaledTileWidth=(this._tileWidth*this._scale);
            this._resourceDirectory="levels/level_1";
        },
        begin: function(){
            this._game._player.setPosition(0,0);
        }
    });
    
    return Level_1;
});