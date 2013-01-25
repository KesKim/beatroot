var GameThrow = function() {
    this.throwable = null;
    this.funk = null;
};

GameThrow.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.throwable.draw(ctx, 10, this.funk * canvas.width);
};

GameThrow.prototype.update = function(timeDelta) {
    
};

GameThrow.prototype.mousedown = function(event) {
};

GameThrow.prototype.mousemove = function(event) {
};

GameThrow.prototype.mouseup = function(event) {
};

GameThrow.prototype.load = function() {
    this.throwable = new GameObject('350x150.gif', 0, 0);
    this.throwable.load();
};