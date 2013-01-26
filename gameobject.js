var GameObject = function(sprite, x, y, rotateAccordingToVelocity, scale) {
    if (rotateAccordingToVelocity === undefined) {
        rotateAccordingToVelocity = true;
    }
    if (scale === undefined) {
        scale = 1.0;
    }
    this.rotateVel = rotateAccordingToVelocity;
    this.scale = scale;
    this.posX = x;
    this.posY = y;
    this.velX = 0;
    this.velY = -10;
    this.accX = null;
    this.accY = null;
    this.gravity = 0.1;
    this.sprite = sprite;
    this.rotation = 0;
};

GameObject.prototype.calculateRotationAccordingToVelocity = function() {
    return Math.atan(this.velY / this.velX);
};

GameObject.prototype.draw = function(canvas, ctx) {
    this.sprite.drawRotated(ctx, this.posX, this.posY, this.rotation, this.scale);
};

GameObject.prototype.update = function(timeDelta) {
    this.velY += (this.gravity * (timeDelta / 16));
    this.posY += (this.velY * (timeDelta / 16));
    this.posX += (this.velX * (timeDelta / 16));
    if (this.rotateVel) {
        this.rotation = this.calculateRotationAccordingToVelocity();
    } else {
        this.rotation += timeDelta * 0.001;
    }
};