define(['jquery','tileset','map','lib/kinetic'], function($,TileSet,Map,kin) {
    var Level = Class.extend({
        init: function(game){
            this._game=game;
        },
        begin: function(){

        },
        getResources:function(){
            this.getTileSet();
            this.getMap();
        },
        getTileSet:function(){
            this._tileset=new TileSet(this._game,this);
        },
        getMap:function(){
            this._map=new Map(this._game,this,this._tileset);
            this._stage = new Kinetic.Stage({
                container:"kineticEntities",
                width:this._game._width,
                height:this._game._height
            });
        },
        resourcesReady:function(){
            return (this.tilesetReady() && 
                    this.mapReady());
        },
        tilesetReady:function(){
            return this._tileset._ready;
        },
        mapReady:function(){
            return this._map._ready;
        }
    });
    
    return Level;
});