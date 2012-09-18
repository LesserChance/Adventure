define(['jquery','renderer','player'], function($,Renderer,Player) {
    var Game = Class.extend({
        init: function(){
            this._width=720;
            this._height=720;

            this.buildLevel("1");
        },
        initCanvas: function(){
            $("#canvas").css({
                'width':this._width,
                'height':this._height
            });

            this._renderer=new Renderer(
                this,
                document.getElementById('base'),
                document.getElementById('fringe'),
                document.getElementById('entities'),
                document.getElementById('foreground')
            );
        },
        initGameFunctions: function(){
            var self=this;
            $(document)
                .bind("keydown", function(e) {
                    if(self.handleKeyDown(e.keyCode)){
                        e.preventDefault();
                    }
                })
                .bind("keyup", function(e) {
                    if(self.handleKeyUp(e.keyCode)){
                        e.preventDefault();
                    }
                });
        },
        buildPlayer:function(){
            this._player=new Player(this);
        },
        buildLevel:function(levelNumber){
            var self=this;
            require(["../levels/level_"+levelNumber+"/level"], function(BuildLevel) {
                self._level=new BuildLevel(self);
                self._level.getResources();
                self.beginLevel();
            });
        },
        beginLevel:function(){
            if(this._level.resourcesReady()){
                this.initCanvas();
                this.initGameFunctions();
                this.buildPlayer();

                this._level.begin();
                this._renderer.drawMap(0,0);
            }else{
                var self=this;
                setTimeout(function(){
                    self.beginLevel();
                },100);
            }
        },
        updateMap:function(offsetX,offsetY){
            this._renderer.drawMap(offsetX,offsetY);
        },
        handleKeyDown:function(keyCode){
            switch(keyCode){
                case 37:
                    this._player.moveLeft();
                    break;
                case 38:
                    this._player.moveUp();
                    break;
                case 39:
                    this._player.moveRight();
                    break;
                case 40:
                    this._player.moveDown();
                    break;
                default:
                    return false;
                    break;
            }
            return true;
        },
        handleKeyUp:function(keyCode){
            switch(keyCode){
                case 37:
                    if(this._player._keepWalkingCallback==this._player.moveLeft){
                        this._player.stopWalking();
                    }
                    break;
                case 38:
                    if(this._player._keepWalkingCallback==this._player.moveUp){
                        this._player.stopWalking();
                    }
                    break;
                case 39:
                    if(this._player._keepWalkingCallback==this._player.moveRight){
                        this._player.stopWalking();
                    }
                    break;
                case 40:
                    if(this._player._keepWalkingCallback==this._player.moveDown){
                        this._player.stopWalking();
                    }
                    break;
                default:
                    return false;
                    break;
            }
            return true;
        },
        checkPosition:function(x,y){
            var m=this._level._map;
            if(x<0||y<0){
                return false;
            }else if(x>m._height-1||y>m._width-1){
                return false;
            }else if(!m._blockedCells[x]){
                return true;
            }else{
                return !m._blockedCells[x][y];
            }
        },
        error:function(throwerClass,err){
            console.log(throwerClass);
            console.log(err);
        }
    });
    
    return Game;
});