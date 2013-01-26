var Game = function() {
    this.isAnExample = true;
    this.funk = 0;
    this.balls = null;
    this.dialog = null;
};

Game.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 255) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.balls.drawRotated(ctx, canvas.width * 0.5, canvas.height * 0.5, this.funk * 2.0, this.funk * 0.5 + 1.0);
    this.dialog.draw(ctx, 100, 300);
};

Game.prototype.update = function(timeDelta) {
    this.funk = Math.sin(time.current * 0.002) * 0.5 + 0.5;
    this.dialog.update(timeDelta);
};

Game.prototype.mousedown = function(event) {
    console.log('mousedown', event.canvasCoords.x, event.canvasCoords.y);
    this.dialog.click();
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

Game.prototype.cleanUp = function() {

}

Game.prototype.startGame = function() {
	this.dialog = new Dialog(
    	new DialogLine('YOLO'),
    	'LOL',
    	'k?'
    );

    this.dialog.start();
}