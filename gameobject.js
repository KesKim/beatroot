var GameObject = function(url, x, y) {
    this.posX = x;
    this.posY = y;
    this.velX = 0;
    this.velY = -10;
    this.accX = null;
    this.accY = null;
    this.gravity = 0.1;
    this.sprite = null;
    this.url = url;
    this.rotation = 0;
};

GameObject.prototype.calculateRotationAccordingToVelocity = function()
{
    return Math.atan(this.velY / this.velX);
};

GameObject.prototype.draw = function(canvas, ctx) {
    this.sprite.drawRotated(ctx, this.posX, this.posY, this.rotation);
};

GameObject.prototype.update = function(timeDelta) {
    this.velY += (this.gravity * (timeDelta / 16));
    this.posY += (this.velY * (timeDelta / 16));
    this.posX += (this.velX * (timeDelta / 16));
    this.rotation = this.calculateRotationAccordingToVelocity();
};

GameObject.prototype.load = function() {
    this.sprite = new Sprite(this.url);
};