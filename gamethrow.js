var GameThrow = function() {
    this.mouseDown = false;
    this.mouseUp = true;
    this.powerMeter = 0;
    this.throwableArray = [];
    this.bg = null;
    this.coordinates = null;
    this.currentVelX = 0;
    this.currentVelY = 0;
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
    }
};

GameThrow.prototype.update = function(timeDelta) {

    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].update();
    };

    if (this.mouseDown)
    {
        this.powerMeter += 0.5;
    }
};

GameThrow.prototype.mousedown = function(event) {
    this.mouseDown = true;
};

GameThrow.prototype.mousemove = function(event) {
    this.coordinates = event.canvasCoords;
};

GameThrow.prototype.mouseup = function(event) {
    if (this.mouseDown)
    {
        var mouseCoords = event.canvasCoords;
        var angle = Math.atan((366 - mouseCoords.y) / (46 - mouseCoords.x));

        this.mouseDown = false;
        var throwableItem = new GameObject('350x150.gif', 50, 250);
        throwableItem.load();
        throwableItem.velX = 10 * Math.cos(angle);
        throwableItem.velY = 10 * Math.sin(angle);

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
};

GameThrow.prototype.isFinished = function() {
    return false;
};

GameThrow.prototype.cleanUp = function() {
    this.resetGame();
};