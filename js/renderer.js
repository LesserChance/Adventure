define(['jquery','camera'], function($,Camera) {
    var Renderer = Class.extend({
        init: function(game, base, fringe, entities, foreground) {
            this._game = game;
            this._baseContext = (base && base.getContext) ? base.getContext("2d") : null;
            this._fringeContext = (fringe && fringe.getContext) ? fringe.getContext("2d") : null;
            this._entitiesContext = (entities && entities.getContext) ? entities.getContext("2d") : null;
            this._foregroundContext = (foreground && foreground.getContext) ? foreground.getContext("2d") : null;

            this._base = base;
            this._fringe = fringe;
            this._entities = entities;
            this._foreground = foreground;

            $(base)
                .add(fringe)
                .add(entities)
                .add(foreground)
                .attr({"width":game._width,"height":game._height});

            this._frameCount = 0;
            this._realFPS = 0;

            this.createCamera();
        },

        createCamera: function() {
            this._camera = new Camera(this._game,this);
        },

        drawMap: function(offsetX,offsetY) {
            var l = this._game._level,
                p = this._game._player,
                c = this._camera;

                this._baseContext.clearRect(0, 0, this._base.width, this._base.height);
                c.updatePositionByTile({"x":p._tileX,"y":p._tileY});

                //render backward so top-left overwrites to its right and bottom
                var hasNextLayer=true;
                var layerCount=0;
                while(hasNextLayer){
                    hasNextLayer=false;
                    for(var row=c._height;row>=-1;row--){
                        for(var col=c._width;col>=-1;col--){
                            if(this.drawTile(this._baseContext,
                                          c._top+row,
                                          c._left+col,
                                          row,
                                          col,
                                          l._tileset,
                                          l._map,
                                          offsetX,
                                          offsetY,
                                          layerCount,
                                          hasNextLayer)){
                                              hasNextLayer=true;
                            }
                        }
                    }
                    layerCount++;
                }
        },

        drawTile: function(ctx, mapRow, mapCol, viewRow, viewCol, tileset, map, offsetX, offsetY, tileLayer, ignoreCheck) {
            if(mapRow<0||mapCol<0){
                //draw a blank tile
            }else if(mapRow>map._height-1||mapCol>map._width-1){
                //draw a blank tile
            }else{
                var tileData=map._mapData[mapRow][mapCol];
                if(tileData[tileLayer]){
//                    for(var i=0,iEnd=tileData.length;i<iEnd;i++){
                        var t=tileset._tiles[tileData[tileLayer]],
                            s=this._game._level._scaledTileWidth,
                            tOffsetX=offsetX,
                            tOffsetY=offsetY;

                        if(t[6]){tOffsetY+=((t[6]/100)*s);}
                        if(t[5]){tOffsetX+=((t[5]/100)*s);}

                        this.drawScaledImage(ctx,
                                             tileset._image,

                                             //position within tile
                                             t[1]*s,//col
                                             t[0]*s,//row
                                             t[2]*s,//width
                                             t[3]*s,//height

                                             //position on map
                                             viewCol*s+tOffsetX,
                                             viewRow*s+tOffsetY);
//                    }
                    if(!ignoreCheck&&tileData[tileLayer+1]){return true;}
                }
            }
        },

        drawEntity: function(entity) {
            var ctx=this._entitiesContext,
                s=entity._sprite,
                sa=s._currentAnimation,
                scale=this._game._level._scaledTileWidth,
                c = this._camera;

            if(s._ready){
                var mapTop=((entity._tileY-c._top)*scale)+s._offsetY,
                    mapLeft=((entity._tileX-c._left)*scale)+s._offsetX;
                    
                //update the image location
                if(sa._flipX){
                    s._image.setScale(-1,1);
                    s._image.x=mapLeft+s._width;
                }else if(sa._flipY){
                    s._image.setScale(1,-1);
                    s._image.y=mapTop+s._height;
                }else{
                    s._image.setScale(1,1);
                    s._image.x=mapLeft;
                    s._image.y=mapTop;
                }
                s._image.srcy=(sa._row*s._height);
                s._imageLayer.draw();
                    
//                //OLD FLIP CODE
//                ctx.save();
//                if(sa._flipX){
//                    ctx.translate(mapLeft+s._width,mapTop);
//                    ctx.scale(-1,1);
//                    
//                    mapTop=0;
//                    mapLeft=0;
//                }
//                
//                //clear the area where the sprite currently is
//                ctx.clearRect(mapTop,
//                             mapLeft,
//                             s._width,
//                             s._height);
//                             
//                //draw the new sprite
//                this.drawScaledImage(ctx,
//                                     s._image,
//
//                                     //position within tile
//                                     0,                   //col
//                                     (sa._row*s._height), //row
//                                     s._width,            //width
//                                     s._height,           //height
//
//                                     //position on map
//                                     mapTop,              //top
//                                     mapLeft);            //left
//                ctx.restore();
                  
             }

        },

        drawScaledImage: function(ctx, image, sx, sy, sw, sh, dx, dy) {
            ctx.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
        }
    });

    return Renderer;
});