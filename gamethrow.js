var GameThrow = function() {
    this.mouseDown = false;
    this.mouseUp = true;
    this.powerMeter = 0;
    this.throwableArray = [];
    this.bg = null;
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
    ctx.fillText('Power: ' + this.powerMeter, 10, 10);
};

GameThrow.prototype.update = function(timeDelta) {

    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].update();
    };

    if (this.mouseDown)
    {
        this.powerMeter -= 0.5;
    }
};

GameThrow.prototype.mousedown = function(event) {
    this.mouseDown = true;
};

GameThrow.prototype.mousemove = function(event) {
};

GameThrow.prototype.mouseup = function(event) {
    if (this.mouseDown === true)
    {
        this.mouseDown = false;
        var throwableItem = new GameObject('350x150.gif', 50, 250);
        throwableItem.load();
        throwableItem.velX = -this.powerMeter;
        throwableItem.velY = this.powerMeter;
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