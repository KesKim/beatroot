var Game = function() {
    this.isAnExample = true;
    this.funk = 0;
    this.bg = null;
    this.beatRoot = null;
    this.beatRootSmall = null;
    this.basket = null;
    this.arrow = null;
    this.dialog = null;
    this.progress = null;
};

Game.prototype.draw = function(canvas, ctx) {
    this.bg.draw(ctx, 0, 0);
    ctx.globalAlpha = this.beatRootOpacity;
    ctx.fillStyle = 'rgb(' + Math.round(this.funk * 20) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.beatRoot.drawRotated(ctx, canvas.width * 0.5, canvas.height * 0.5, this.funk * 0.5 - 0.25, this.funk * 0.5 + 1.0);
    ctx.globalAlpha = 1.0;
    if (this.stateMachine.state !== 'dialog') {
        this.progress.draw(ctx);
        for (var i = 0; i < this.objects.length; ++i) {
            this.objects[i].draw(canvas, ctx);
        }
    }
    ctx.globalAlpha = 1.0 - this.beatRootOpacity;
    this.basket.drawRotated(ctx, this.basketX, gameCanvas.height - 35, 0.0, 0.8);
    ctx.globalAlpha = (0.5 - Math.abs(0.5 - this.arrowFade)) * 2.0;
    this.arrow.drawRotated(ctx, this.basketX, gameCanvas.height - 100 - Math.sin(this.arrowFade * 40.0) * 10.0, 0.0, 1.0);
    ctx.globalAlpha = 1.0;
    this.dialog.draw(ctx, 320, 420, true);
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
        this.progress.update(timeDelta);
        this.rootDensity += 0.000015 * timeDelta;
        if (this.rootDensity > 1.0) {
            this.rootDensity = 1.0;
        }
        this.arrowFade += 0.00015 * timeDelta;
        if (this.arrowFade > 1.0) {
            this.arrowFade = 1.0;
        }
        this.beatRootOpacity -= 0.001 * timeDelta;
        if (this.beatRootOpacity < 0) {
            this.beatRootOpacity = 0;
        }
        var i = 0; 
        var spliced = false;
        while (i < this.objects.length) {
            spliced = false;
            this.objects[i].update(timeDelta);
            if (this.objects[i].posY > gameCanvas.height - 20) {
                if (this.objects[i].posY > gameCanvas.height + 20) {
                    this.objects.splice(i, 1);
                    spliced = true;
                }
            } else if (this.objects[i].posY > gameCanvas.height - 50) {
                if (this.objects[i].posX > this.basketX - 30 && this.objects[i].posX < this.basketX + 30) {
                    this.objects.splice(i, 1);
                    spliced = true;
                    this.progress.add(0.042);
                }
            }
            if (!spliced) {
                ++i;
            }
        }
        if (!this.progress.finished && Math.random() < timeDelta * 0.01 * Math.pow(this.rootDensity, 1.5)) {
            var newObj = new GameObject(this.beatRootSmall, Math.random() * (gameCanvas.width - 30) + 15, -50.0 - Math.random() * 50.0, false, 1.0);
            newObj.gravity = 0.01;
            newObj.velY = 0;
            newObj.rotation = Math.random() * Math.PI * 2;
            this.objects.push(newObj);
        }
        if (this.progress.finished && this.stateMachine.state === 'dropping-modern') {
            this.advanceState();
        }
    }
};

Game.prototype.mousedown = function(event) {
    this.dialog.click();
};

Game.prototype.mousemove = function(event) {
    if (event.canvasCoords.x > 30 && event.canvasCoords.x < gameCanvas.width - 30) {
        this.basketX = event.canvasCoords.x;
    }
};

Game.prototype.mouseup = function(event) {
};

Game.prototype.load = function() {
    this.bg = new Sprite('bg-jungle-boogie.png');
    this.beatRoot = new Sprite('beatroot-big.png');
    this.basket = new Sprite('basket.png');
    this.arrow = new Sprite('arrow.png');
    this.beatRootSmall = new Sprite('beatroot-small.png');
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
        'From now on, things are going to get a lot more funky.',
        'Use your powers wisely.']
    );

    this.dialog.start();
    this.stateMachine = new StateMachine(['dialog', 'dropping-jungle', 'dropping-modern', 'finished']);
    this.progress = new Progress('Funk', 0.0, 0.0);
    this.beatRootOpacity = 1.0;
    this.arrowFade = 0.0;
    this.basketX = 320;
    this.rootDensity = 0.0;
    this.objects = [];
};