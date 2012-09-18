define(['jquery'], function($) {
    var Camera = Class.extend({
        init: function(game,renderer){
            this._game=game;
            this._renderer=renderer;

            this._top=0;
            this._left=0;
            this._width=game._width/game._level._scaledTileWidth;
            this._height=game._height/game._level._scaledTileWidth;
        },
        updatePositionByTile: function(center){
            this._left=center.x-((this._width-1)/2);
            this._top=center.y-((this._height-1)/2);
        }
    });

    return Camera;
});