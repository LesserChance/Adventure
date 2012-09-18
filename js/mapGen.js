define(['jquery','renderer','tileset','lib/kinetic'], function($,Renderer,Tileset,kin) {
    var MapGen = Class.extend({
        init: function(){
            this._width=1280;
            this._height=600;
            
            this._mapRows=20;
            this._mapCols=20;
            this._mapVisibleRows=10;
            this._mapVisibleCols=10;
            this._mapOffset={
                x:0,
                y:0
            };
            
            this._mapLayer = new Kinetic.Layer();
            this._mapGrid=new Array();
            
            $("#mapCanvas").css({
                'width':this._width,
                'height':this._height
            });
            
            this.generateTileset("1");
        },
        moveMap: function(x,y){
            if(x!=null){this._mapOffset.x=this._mapOffset.x+x;}
            if(y!=null){this._mapOffset.y=this._mapOffset.y+y;}
            this.generateMap();
            this._mapLayer.draw();
        },
        generateMap: function(){
            //draw a grid
            var tileGrid,
                tW=this._level._scaledTileWidth,
                offsetX=(this._tilesetCols+1)*tW+(this._tilesetCols*2);
                
            for(var row=0;row<this._mapRows;row++){
                for(var col=0;col<this._mapCols;col++){
                    if(!this._mapGrid[row]){this._mapGrid[row]=new Array();}
                    
                    var setX=(col-this._mapOffset.x)*tW+offsetX,
                        setY=(row-this._mapOffset.y)*tW;
                        
                    if(!this._mapGrid[row][col]){
                        //make a cell
                        var newCell=new Kinetic.Rect({
                            width:tW,
                            height:tW,
                            fill: "#FFF",
                            stroke: "black",
                            strokeWidth: 1
                        });
                        tileGrid={
                            'row':row,
                            'col':col,
                            'grid':newCell,
                            'tile':[]
                        };
                        this._mapGrid[row][col]=tileGrid;
                        this._mapLayer.add(newCell);
                    }else{
                        tileGrid=this._mapGrid[row][col];
                    }
                    this.updateTileGrid(tileGrid,row,col,setX,setY);
                }
            }
        },
        updateTileGrid: function(tileGrid,row,col,setX,setY){
            tileGrid.x=setX;
            tileGrid.y=setY;
            tileGrid.grid.x=setX;
            tileGrid.grid.y=setY;

            if(row>=this._mapOffset.y&&
                row<this._mapOffset.y+this._mapVisibleRows&&
                col>=this._mapOffset.x&&
                col<this._mapOffset.x+this._mapVisibleCols){

                //show it
                tileGrid.grid.show();

                //update a the tiles
                for(var i=0,iEnd=tileGrid.tile.length;i<iEnd;i++){
                    tileGrid.tile[i].x=setX;
                    tileGrid.tile[i].y=setY;
                    tileGrid.tile[i].show();
                }
            }else{
                //hide it
                tileGrid.grid.hide();

                //update a the tiles
                for(var i=0,iEnd=tileGrid.tile.length;i<iEnd;i++){
                    tileGrid.tile[i].x=setX;
                    tileGrid.tile[i].y=setY;
                    tileGrid.tile[i].hide();
                }
            }
        },
        generateTileset: function(levelNumber){
            var self=this;
            require(["../levels/level_"+levelNumber+"/level"], function(BuildLevel) {
                self._level=new BuildLevel(self);
                self._level.getTileSet();
                self.finishGenerateTileset(self._level);
            });
        },
        finishGenerateTileset: function(level){
            if(level.tilesetReady()){
                var tiles=level._tileset._tiles;
                this._tilesetRows=0;
                this._tilesetCols=0;
                    
                for(var tileName in tiles){
                    var t=tiles[tileName];
                    if(t[0]>this._tilesetRows){this._tilesetRows=t[0];}
                    if(t[1]>this._tilesetCols){this._tilesetCols=t[1];}
                }
                this._tilesetRows++;
                this._tilesetCols++;
                
                this.drawTileset();
                this.generateMap();
                this.generateStage();
            }else{
                var self=this;
                setTimeout(function(){
                    self.finishGenerateTileset(level);
                },100);
            }
        },
        drawTileset: function(){
            var tiles=this._level._tileset._tiles,
                tI=this._level._tileset._image,
                tW=this._level._scaledTileWidth;
                
            this._tilesetLayer = new Kinetic.Layer();
            for(var tileName in tiles){
                var t=tiles[tileName];
                this.generateTileImage(tI,tW,t,null,null,true,this._tilesetLayer);
            }
        },
        startDragTile: function(tileImage){
            //duplicate the tileImage
            this.generateTileImage(this._level._tileset._image,
                                  this._level._scaledTileWidth,
                                  tileImage.tileData,
                                  null,null,true,
                                  this._tilesetLayer);
                                  
            tileImage.moveToTop();
        },
        endDragTile: function(tileImage,e){
            if(tileImage.parentCell){
                //remove the tile from the cell that it was dragged from
                tileImage.parentCell.tile.splice(tileImage.parentCellIndex,1);
            }
            
            var tw=this._level._scaledTileWidth,
                //match to center of top-left tile
                checkX=tileImage.x+(tw/2),
                checkY=tileImage.y+(tw/2);
                
            //check to see what grid space it was dropped into, assuming a 1x1 tile
            var foundCell=false;
            for(var row=this._mapOffset.y;row<this._mapOffset.y+this._mapVisibleRows;row++){
                for(var col=this._mapOffset.x;col<this._mapOffset.x+this._mapVisibleCols;col++){
                    if(row>=0&&row<this._mapRows&&col>=0&&col<this._mapCols){
                        var mG=this._mapGrid[row][col];
                        if(mG.x<checkX){
                            if(mG.x+tw>checkX){
                                if(mG.y<checkY){
                                    if(mG.y+tw>checkY){
                                        foundCell=mG;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            tileImage.hide();
            this._tilesetLayer.draw();
            if(foundCell){
                var newTileImage=this.generateTileImage(this._level._tileset._image,
                                  this._level._scaledTileWidth,
                                  tileImage.tileData,
                                  foundCell.x,foundCell.y,
                                  false,
                                  this._mapLayer);
                                  
                //add the tile to the new cell
                newTileImage.parentCellIndex=foundCell.tile.length;
                foundCell.tile[newTileImage.parentCellIndex]=newTileImage;
                newTileImage.parentCell=foundCell;
            }
            this._mapLayer.draw();
        },
        generateTileImage: function(tI,tW,t,posX,posY,showStroke,addToLayer){
            var tileImageSetup={
                image:tI,
                width:t[2]*tW,
                height:t[3]*tW,
                srcx:t[1]*tW,
                srcy:t[0]*tW,
                srcwidth:t[2]*tW,
                srcheight:t[3]*tW,
                x:posX || t[1]*tW+(t[1]*1),
                y:posY || t[0]*tW+(t[0]*1),
                draggable:true
            };
            if(showStroke){
                tileImageSetup.stroke="black";
                tileImageSetup.strokeWidth=1;
            }
            var tileImage=new Kinetic.QImage(tileImageSetup);
            
            //additional data
            var self=this;
            tileImage.tileData=t;
            tileImage.on("mouseover", function() {
                document.body.style.cursor = "pointer";
            });
            tileImage.on("mouseout", function() {
                document.body.style.cursor = "default";
            });
            tileImage.on("dragstart", function() {
                self.startDragTile(this);
            });
            tileImage.on("dragend", function(e) {
                self.endDragTile(this,e);
            });
            addToLayer.add(tileImage);
            return tileImage;
        },
        generateStage: function(){
            this._stage = new Kinetic.Stage({
                container:"mapCanvas",
                width:this._width,
                height:this._height
            });

            this._stage.add(this._mapLayer);
            this._stage.add(this._tilesetLayer);
        }
    });
    
    return MapGen;
});