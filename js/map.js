define(['jquery','lib/kinetic'], function($,kin) {
    var Map = Class.extend({
        init: function(game,level,tileset){
            this._game=game;
            this._level=level;
            this._tileset=tileset;

            var self=this;
            var mapDataFilePath=this._level._resourceDirectory+"/data/map.json";

            $.getJSON(mapDataFilePath, function(data) {
                self.saveMap(data);
            })
            .error(function(data, textStatus, errorThrown){
                self._game.error("map",errorThrown);
            });
        },
        saveMap:function(data){
            this._width=data.width;
            this._height=data.height;
            this._mapData=data.construction;
            this.generateBlockedTiles();
        },
        generateBlockedTiles: function(){
            this._blockedCells=new Array();
            var ts=this._tileset;
            var md=this._mapData;
            if(ts._ready){
                for(var i=0,iEnd=md.length;i<iEnd;i++){
                    for(var j=0,jEnd=md[i].length;j<jEnd;j++){
                        var tileData=md[i][j];
                        for(var k=0,kEnd=tileData.length;k<kEnd;k++){
                            var t=ts._tiles[tileData[k]];
                            if(t[4]){
                                this.blockArea(i,j,t[2],t[3]);
                            }
                        }
                    }
                }
                this.ready();
            }else{
                var self=this;
                setTimeout(function(){
                    self.generateBlockedTiles();
                },100);
            }
        },
        blockArea: function(x,y,w,h){
            var rowBlocked=0;
            while(rowBlocked<h){
                var colBlocked=0;
                while(colBlocked<w){
                    this.blockCell(x+rowBlocked,y+colBlocked);
                    colBlocked++;
                }
                rowBlocked++;
            }
        },
        blockCell: function(x,y){
            if(!this._blockedCells[x]){this._blockedCells[x]=new Array();}
            this._blockedCells[x][y]=true;
        },
        ready: function(){
            this._ready=true;
        }
    });
    
    return Map;
});