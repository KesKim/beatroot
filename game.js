var Game = function() {
    this.isAnExample = true;
    this.funk = 0;
    this.beatRoot = null;
    this.dialog = null;
};

Game.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 20) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.beatRoot.drawRotated(ctx, canvas.width * 0.5, canvas.height * 0.5, this.funk * 0.5 - 0.25, this.funk * 0.5 + 1.0);
    this.dialog.draw(ctx, 100, 300);
};

Game.prototype.update = function(timeDelta) {
    this.funk = Math.sin(time.current * 0.002) * 0.5 + 0.5;
    this.dialog.update(timeDelta);
};

Game.prototype.mousedown = function(event) {
    this.dialog.click();
};

Game.prototype.mousemove = function(event) {
};

Game.prototype.mouseup = function(event) {
};

Game.prototype.load = function() {
    this.beatRoot = new Sprite('beatroot-big.png');
};

Game.prototype.isFinished = function() {
    return this.dialog.finished;
};

Game.prototype.cleanUp = function() {

}

Game.prototype.startGame = function() {
	this.dialog = new Dialog([
        new DialogLine('I AM THE BEATROOT.'),
        'Nice to meet you.',
        'You\'ve got the funk now.',
        'Use it wisely.']
    );

    this.dialog.start();
}