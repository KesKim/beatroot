var GameWank = function(progressTitle, dialogLines, musicFilename, bgFilename, objectFilename) {
    this.progressTitle = progressTitle;
    this.dialogLines = dialogLines;
    this.musicFilename = musicFilename;
    this.bgFilename = bgFilename;
    this.objectFilename = objectFilename;
    this.background = null;
    this.objectSprite = null;
    this.music = null;
    this.resetGame();
};

GameWank.prototype.resetGame = function() {
    this.isAnExample = false;
    this.wankedAmount = 0;
    this.wankRequired = 1000;
    this.lastDirection = 0;
    this.oneDirectionAdded = 0;
    this.oneDirectionLimit = 50;
    this.lastWankPosition = null;
    this.dialog = new Dialog(this.dialogLines);
    this.progress = new Progress(this.progressTitle, 0.0, 0.0);
    this.stateMachine = new StateMachine(['started', 'dialog', 'finished']);
}

GameWank.prototype.draw = function(canvas, ctx) {    
    this.background.draw(ctx, 0, 0);
    var drawPosX = this.lastWankPosition ? this.lastWankPosition.x : (canvas.width / 2);
    var drawPosY = this.lastWankPosition ? this.lastWankPosition.y : (canvas.height / 2);
    this.objectSprite.draw(ctx, drawPosX - (this.objectSprite.width / 2), drawPosY - (this.objectSprite.height / 2));
    this.progress.draw(ctx);
    this.dialog.draw(ctx, 100, 200);
};

GameWank.prototype.update = function(timeDelta) {
    this.progress.update(timeDelta);
    if (this.stateMachine.state === 'started') {
        if (this.progress.finished) {
            this.stateMachine.advance();
            this.dialog.start();
        }
    } else if (this.stateMachine.state === 'dialog') {
        this.dialog.update(timeDelta);
        if (this.dialog.finished) {
            this.stateMachine.advance();
        }
    }
};

GameWank.prototype.mousedown = function(event) {
    if (this.stateMachine.state === 'started') {
        this.clickHeld = true;
        this.lastWankPosition = event.canvasCoords;
    } else if (this.stateMachine.state === 'dialog') {
        this.dialog.click();
    }
};

GameWank.prototype.mousemove = function(event) {
    if (this.clickHeld === true && this.stateMachine.state === 'started') {
        var currentPos = event.canvasCoords;

        var xDistance = currentPos.x - this.lastWankPosition.x;

        var currentDirection = xDistance < 0 ? -1 : 1;

        var directionChanged = currentDirection !== this.lastDirection;

        if (directionChanged === true) {
            // Reset one-way-wank limiter.
            this.oneDirectionAdded = 0;
        }

        if (this.oneDirectionAdded <= this.oneDirectionLimit) {
            var absDistance = Math.abs(xDistance);
            this.progress.add(absDistance / this.wankRequired);
            this.oneDirectionAdded += absDistance;
        }

        this.lastDirection = xDistance < 0 ? -1 : 1;
        this.lastWankPosition = currentPos;
    }
};  

GameWank.prototype.mouseup = function(event) {
    this.clickHeld = false;
    this.lastDirection = 0;
    this.lastWankPosition = null;
    this.oneDirectionAdded = 0;
};

GameWank.prototype.load = function() {
    this.background = new Sprite(this.bgFilename);
    this.objectSprite = new Sprite(this.objectFilename);
    if (this.musicFilename !== null) {
        this.music = new Audio(this.musicFilename);
    }
};

GameWank.prototype.isFinished = function() {
    return this.stateMachine.state === 'finished';
};

GameWank.prototype.cleanUp = function() {
    this.resetGame();
    if (this.music !== null) {
        this.music.stop();
    }
};

GameWank.prototype.startGame = function() {
    if (this.music !== null) {
        this.music.play();
    }
}