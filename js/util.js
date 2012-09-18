var Util = {
    generateRandomMap: function(w,h,levelNumber){
        var self=this;
        require(["../levels/level_"+levelNumber+"/level"], function(BuildLevel) {
            var level=new BuildLevel();
            level.getTileSet();
            self.finishGenerateRandomMap(w,h,level);
        });
    },
    finishGenerateRandomMap: function(w,h,level){
        if(level.tilesetReady()){
            var c=0,
                r=0,
                ts=level._tileset,
                mapData={
                    "width":w,
                    "height":h,
                    "construction":[]
                };
                
            while(r<h){
                c=0;
                mapData.construction[r]=new Array();
                while(c<w){
                    //pick an unblocked tile at random
                    var randTileCount = 0;
                    var randTile;
                    do{
                        for (var prop in ts._tiles)
                            if (Math.random() < 1/++randTileCount)
                               randTile=prop;
                    }while(ts._tiles[randTile][4]);
                    mapData.construction[r][c]=[randTile];
                    
                    c++;
                }
                r++;
            }
            
            console.log(JSON.stringify(mapData));
        }else{
            var self=this;
            setTimeout(function(){
                self.finishGenerateRandomMap(w,h,level);
            },100);
        }
    }
};