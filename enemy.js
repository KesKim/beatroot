var Enemy = function(sprite, x, y) {
    this.posX = x;
    this.posY = y;
    this.velX = 3;
    this.velY = 0;
    this.accX = null;
    this.accY = null;
    this.sprite = sprite;
    this.rotation = 0;
    this.canvasWidth = 0;
    this.moveForward = true;
    this.circleRadius = 25;
    this.collides = false;
    this.destroyed = false;
};

Enemy.prototype.draw = function(canvas, ctx) {
    if (!this.destroyed)
    {
        this.sprite.drawRotated(ctx, this.posX, this.posY, this.rotation);

        // if (developerMode)
        // {
        //     ctx.beginPath();
        //     ctx.arc(this.posX, this.posY, this.circleRadius, 0, 2 * Math.PI, false);
        //     ctx.lineWidth = 2;
        //     ctx.strokeStyle = '#003300';
        //     ctx.stroke();
        // }
    }

    this.canvasWidth = canvas.width;
};

Enemy.prototype.isColliding = function(x, y)
{
    var dist = Math.sqrt(Math.pow((this.posX - x), 2) + Math.pow((this.posY - y), 2));

    if (dist <= this.circleRadius)
    {
        this.destroyed = true;
    }
}

Enemy.prototype.update = function(timeDelta, start, end) {
    if (this.posX < end && this.moveForward)
    {
        this.moveForward = true;
        this.posX += (this.velX * (timeDelta / 16));
    }
    else if (this.posX < start && !this.moveForward)
    {
        this.moveForward = true;
    }
    else
    {
        this.moveForward = false;
        this.posX -= (this.velX * (timeDelta / 16));
    }

    // TODO: Does not work
    this.posY += this.goToSineY(1,100);
};

Enemy.prototype.goToSineY = function(amplitude, frequency, time)
{
    return amplitude * Math.sin(2 * Math.PI * frequency);
};

Enemy.prototype.goToSineX = function(amplitude, frequency, time)
{
    return amplitude * Math.sin(2 * Math.PI * frequency);
};