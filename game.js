var Game = function() {
    this.isAnExample = true;
    this.funk = 0;
    this.balls = null;
};

Game.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 255) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.balls.draw(ctx, 10, this.funk * canvas.height * 0.5);
};

Game.prototype.update = function(timeDelta) {
    this.funk = Math.sin(time.current * 0.002) * 0.5 + 0.5;
};

Game.prototype.mousedown = function(event) {
};

Game.prototype.mousemove = function(event) {
};

Game.prototype.mouseup = function(event) {
};

Game.prototype.load = function() {
    this.balls = new Sprite('350x150.gif');
};

Game.prototype.isFinished = function() {
    return false;
};