define(['jquery'], function($) {
    var TileSet = Class.extend({
        init: function(game,level,readyCallback){
            this._game=game;
            this._level=level;
            this._readyCallback=readyCallback;

            this._image = new Image();
            this._image.src = level._resourceDirectory+"/img/tileset.png";

            var self=this;
            this._image.onload = function() {
                self._tilesetsLoaded = true;
                self.getTilesetData();
            };
        },
        getTilesetData:function(){
            var self=this;
            var tilesetDataFilePath=this._level._resourceDirectory+"/data/tileset.json";

            $.getJSON(tilesetDataFilePath, function(data) {
                self.saveTileset(data);
            })
            .error(function(data, textStatus, errorThrown){
                self._game.error("tileset",errorThrown);
            });
        },
        saveTileset:function(data){
            this._tiles=data;
            this._ready=true;
            if(this._readyCallback){
                this._readyCallback.call();
            }
        }
    });

    return TileSet;
});