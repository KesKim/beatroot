var GameThrow = function() {
    this.throwable = null;
    this.mouseDown = false;
    this.mouseUp = true;
};

GameThrow.prototype.resetGame = function() {
    this.throwable = null;
    this.load();
}

GameThrow.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 255) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.throwable
    this.throwable.draw(canvas, ctx);
};

GameThrow.prototype.update = function(timeDelta) {
    this.throwable.update();
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
        this.load();
    }

    this.mouseUp = true;
};

GameThrow.prototype.load = function() {
    this.throwable = new GameObject('350x150.gif', 200, 200);
    this.throwable.load();
};

GameThrow.prototype.isFinished = function() {
    return false;
};

GameThrow.prototype.cleanUp = function() {
    this.resetGame();
};