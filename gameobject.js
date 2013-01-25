var GameObject = function(url, x, y) {
    this.posX = x;
    this.posY = y;
    this.velX = null;
    this.velY = null;
    this.accX = null;
    this.accY = null;
    this.sprite = null;
};

GameObject.prototype.draw = function(canvas, ctx) {
    this.sprite.draw(ctx, this.posX, this.posY);
};

GameObject.prototype.update = function(timeDelta) {
    this.posX = Math.sin(time.current * 0.002) * 0.5 + 0.5;
};

GameObject.prototype.load = function(url) {
    this.sprite = new Sprite(url);
};