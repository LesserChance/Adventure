define(['jquery','animation','lib/kinetic'], function($, Animation, kin) {
    var Sprite = Class.extend({
        init: function(name,game,entity) {
            this._game=game;
            this._name=name;
            this._entity=entity;
            this._offsetX=0;
            this._offsetY=0;
            this._animations = null;
            this._currentAnimation = null;
            this.getSpriteData();
        },
        getSpriteData: function() {
            var self=this;
            var spriteDataFilePath=this._game._level._resourceDirectory+"/sprite/"+this._name+".json";

            $.getJSON(spriteDataFilePath, function(data) {
                self.loadJSON(data);
            })
            .error(function(data, textStatus, errorThrown){
                self._game.error("sprite",errorThrown);
            });
        },
        loadJSON: function(data) {
            this._filepath=this._game._level._resourceDirectory+"/img/sprite_"+this._name+".png";
            this._animationData=data.animations;
            this._width=data.width;
            this._height=data.height;
            this._offsetX=(data.offset_x !== undefined) ? data.offset_x : 0;
            this._offsetY=(data.offset_y !== undefined) ? data.offset_y : 0;

            this.load();
        },
        load: function() {
            var self=this;

            this._baseImage=new Image();
            this._baseImage.src=this._filepath;

            this._baseImage.onload=function() {
                self._ready=true;
                self.createKineticImage();
                self.createAnimations();
            };
        },
        createKineticImage: function() {
            this._imageLayer = new Kinetic.Layer();
            this._image=new Kinetic.QImage({
                image:this._baseImage,
                width:this._width,
                height:this._height,
                srcx:0,
                srcy:0,
                srcwidth:this._width,
                srcheight:this._height,
                x:0,
                y:0
            });
            this._imageLayer.add(this._image);
            
            this._game._level._stage.add(this._imageLayer);
        },
        createAnimations: function() {
            console.log(this._width);
            console.log(this._height);
            this._animations={};
            for(var name in this._animationData) {
                var a=this._animationData[name];
                this._animations[name]=new Animation(this, name, a.length, a.row, this._width, this._height);
                
                var flipAnimation=name.indexOf("_right");
                if(flipAnimation>-1){
                    //duplicate this row
                    var flipName=name.substr(0,flipAnimation)+"_left";
                    this._animations[flipName]=new Animation(this, flipName, a.length, a.row, this._width, this._height, true);
                }
            }
        },
        getAnimationByName: function(name) {
            var animation = this._animations[name];
            return animation;
        },
        setAnimation: function(name, speed, count, onEndCount) {
            if(this._ready){
                var self = this;

                if(this._currentAnimation && this._currentAnimation._name === name) {
                    return;
                }else{
                    if(this._currentAnimation){
                        this.stopAnimation();
                    }
                    var a = this.getAnimationByName(name);

                    if(a) {
                        this._currentAnimation = a;
                        this._currentAnimation.setSpeed(speed);
                        this._currentAnimation.setCount(count ? count : 0, onEndCount || function() {
                            self.idle();
                        });
                    }
                }
            }
        },
        startAnimation: function() {
            if(this._currentAnimation){
                this._currentAnimation.start();
            }
        },
        stopAnimation: function() {
            if(this._currentAnimation){
                this._currentAnimation.stop();
            }
        },
        resetAnimation: function() {
            if(this._currentAnimation){
                this._currentAnimation.stop();
                this._currentAnimation.reset();
                this._imageLayer.draw();
            }
        }
    });

    return Sprite;
});