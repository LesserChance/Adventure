define(['jquery'], function($) {
    var Animation = Class.extend({
        init: function(sprite, name, length, row, width, height, flipX, flipY) {
            this._sprite = sprite;
            this._name = name;
            this._length = length;
            this._row = row;
            this._width = width;
            this._height = height;
            this._flipX = flipX;
            this._flipY = flipY;
            this.reset();
        },

        tick: function() {
            var i = this._currentFrame.index,
                s = this._sprite;

            i = (i < this._length - 1) ? i + 1 : 0;

            if(this.count > 0) {
                if(i === 0) {
                    this.count -= 1;
                    if(this.count === 0) {
                        this._currentFrame.index = 0;
                        this.endcount_callback();
                        return;
                    }
                }
            }

            this._currentFrame.x = this._width * i;
            this._currentFrame.y = this._height * this._row;
            this._currentFrame.index = i;
            
            //draw the sprite
            s._image.srcx=this._currentFrame.x;
            s._image.srcy=this._currentFrame.y;
            s._imageLayer.draw();
        },

        setSpeed: function(speed) {
            this._speed = speed;
        },

        setCount: function(count, onEndCount) {
            this._count = count;
            this._endcount_callback = onEndCount;
        },

        start: function() {
            this.tick();
            var self=this;
            this._tickTimeout=setInterval(function(){
                self.tick();
            },this._speed);
        },
        
        stop: function() {
            clearInterval(this._tickTimeout);
        },

        reset: function() {
            this._lastTime = 0;
            this._currentFrame = { index: 0, x: 0, y: this.row * this.height };
        }
    });
    
    return Animation;
});