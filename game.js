var Game = function() {
    this.isAnExample = true;
    this.funk = 0;
    this.bg = null;
    this.beatRoot = null;
    this.dialog = null;
    this.progress = null;
    this.objects = [];
};

Game.prototype.draw = function(canvas, ctx) {
    this.bg.draw(ctx, 0, 0);
    ctx.globalAlpha = this.beatRootOpacity;
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 20) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.beatRoot.drawRotated(ctx, canvas.width * 0.5, canvas.height * 0.5, this.funk * 0.5 - 0.25, this.funk * 0.5 + 1.0);
    ctx.globalAlpha = 1.0;
    this.dialog.draw(ctx, 100, 300);
    if (this.stateMachine.state !== 'dialog') {
        this.progress.draw(ctx);
        for (var i = 0; i < this.objects.length; ++i) {
            this.objects[i].draw(canvas, ctx);
        }
    }
};

Game.prototype.update = function(timeDelta) {
    this.funk = Math.sin(time.current * 0.002) * 0.5 + 0.5;
    this.stateMachine.update(timeDelta);
    if (this.stateMachine.state === 'dialog') {
        this.dialog.update(timeDelta);
        if (this.dialog.finished) {
            this.stateMachine.advance();
        }
    } else {
        this.beatRootOpacity -= 0.001 * timeDelta;
        if (this.beatRootOpacity < 0) {
            this.beatRootOpacity = 0;
        }
        for (var i = 0; i < this.objects.length; ++i) {
            this.objects[i].update(timeDelta);
        }
    }
};

Game.prototype.mousedown = function(event) {
    this.dialog.click();
};

Game.prototype.mousemove = function(event) {
};

Game.prototype.mouseup = function(event) {
};

Game.prototype.load = function() {
    this.bg = new Sprite('bg-jungle-boogie.png');
    this.beatRoot = new Sprite('beatroot-big.png');
};

Game.prototype.isFinished = function() {
    return this.stateMachine.state === 'finished';
};

Game.prototype.cleanUp = function() {

};

Game.prototype.startGame = function() {
	this.dialog = new Dialog([
		new DialogLine('YOU HAVE FOUND ME.'),
        new DialogLine('I AM THE BEATROOT OF INSPIRATION.'),
        'Nice to meet you.',
        'You\'ve got the funk now.',
        'Use it wisely.']
    );

    this.dialog.start();
    this.stateMachine = new StateMachine(['dialog', 'dropping-jungle', 'dropping-modern', 'finished']);
    this.progress = new Progress('Funk', 0.0, 0.0);
    this.beatRootOpacity = 1.0;
};