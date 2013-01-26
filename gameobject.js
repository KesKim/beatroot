var GameObject = function(url, x, y) {
    this.posX = x;
    this.posY = y;
    this.velX = -10;
    this.velY = -20;
    this.accX = null;
    this.accY = null;
    this.gravity = 1;
    this.sprite = null;
    this.url = url;
};

GameObject.prototype.draw = function(canvas, ctx) {
    this.sprite.draw(ctx, this.posX, this.posY);
};

GameObject.prototype.update = function(timeDelta) {
    this.velY += this.gravity;
    this.posY += this.velY;
    this.posX += this.velX;
};

GameObject.prototype.load = function() {
    this.sprite = new Sprite(this.url);
};