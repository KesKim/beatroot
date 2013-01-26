var GameThrow = function() {
    this.mouseDown = false;
    this.mouseUp = true;
    this.powerMeter = 0;
    this.throwableArray = [];
    this.bg = null;
    this.coordinates = null;
    this.currentVelX = 0;
    this.currentVelY = 0;
    this.angleRadians = 0;
    this.startPointX = 125;
    this.startPointY = 310;
    this.characterArmThrown = null;
    this.characterArmCharge = null;
};

GameThrow.prototype.resetGame = function() {
    this.throwableArray = [];
}

GameThrow.prototype.draw = function(canvas, ctx) {
    this.bg.draw(ctx, 0, 0);

    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].draw(canvas, ctx);
    };

    ctx.fillStyle = 'red';
    ctx.fillText('Power: ' + this.powerMeter, 20, 20);

    if (this.coordinates != null)
    {
        ctx.fillText('Mouse X: ' + this.coordinates.x, 20, 40);
        ctx.fillText('Mouse Y: ' + this.coordinates.y, 20, 60);
        ctx.fillText('Velocity: ' + this.currentVelX + ', ' + this.currentVelY, 20, 80);
        ctx.fillText('Angle: ' + this.angleRadians, 20, 100);
        ctx.fillText('MouseDown: ' + this.mouseDown, 20, 120);
        ctx.fillText('MouseUp: ' + this.mouseUp, 20, 140);
    }

    if (this.mouseUp)
    {
        this.characterArmThrown.drawRotated(ctx, 47, 366);
    }

    if (this.mouseDown)
    {
        this.characterArmCharge.drawRotated(ctx, 47, 366);
    }

};

GameThrow.prototype.update = function(timeDelta) {

    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].update();
    };

    if (this.mouseDown)
    {
        if (this.powerMeter < 15)
        {
            this.powerMeter += 0.5; 
        }
    }
};

GameThrow.prototype.mousedown = function(event) {
    if (event.canvasCoords.x > 46 && event.canvasCoords.y < 366)
    {
        this.mouseDown = true;  
        this.mouseUp = false;
    }
};

GameThrow.prototype.mousemove = function(event) {
    this.coordinates = event.canvasCoords;
};

GameThrow.prototype.mouseup = function(event) {
    if (this.mouseDown)
    {
        var mouseCoords = event.canvasCoords;
        var angle = Math.atan((this.startPointY - mouseCoords.y) / (this.startPointX - mouseCoords.x));

        if (angle > 0)
            angle = 0;

        if (angle < -1.4)
            angle = -1.4;

        this.angleRadians = angle;
        this.mouseDown = false;
        var throwableItem = new GameObject('spear.png', 46, 366);
        throwableItem.load();
        throwableItem.velX = this.powerMeter * Math.cos(angle);
        throwableItem.velY = this.powerMeter * Math.sin(angle);

        this.currentVelX = throwableItem.velX;
        this.currentVelY = throwableItem.velY;

        if (this.throwableArray.length > 30)
        {
            this.throwableArray = [];
        }

        this.throwableArray.push(throwableItem);
    }

    this.powerMeter = 0;
    this.mouseUp = true;
};

GameThrow.prototype.load = function() {
    this.bg = new Sprite('bg-ancient.png');
    this.characterArmThrown = new Sprite('thrown.png');
    this.characterArmCharge = new Sprite('spearthrow.png');
};

GameThrow.prototype.isFinished = function() {
    return false;
};

GameThrow.prototype.cleanUp = function() {
    this.resetGame();
};