var GameObject = function(url, x, y) {
    this.posX = x;
    this.posY = y;
    this.velX = null;
    this.velY = 1;
    this.accX = null;
    this.accY = null;
    this.sprite = null;
    this.url = url;
};

GameObject.prototype.draw = function(canvas, ctx) {
    this.sprite.draw(ctx, this.posX, this.posY);
};

GameObject.prototype.update = function(timeDelta) {
    this.posY += this.velY;
};

GameObject.prototype.load = function() {
    this.sprite = new Sprite(this.url);
};