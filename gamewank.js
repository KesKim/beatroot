var GameWank = function(progressTitle, wankRequired, dialogLines, musicFilename, bgFilename, objectFilename, focusPoint, xLimit, yLimit) {
    if (xLimit === undefined) {
        xLimit = 320;
    }
    if (yLimit === undefined) {
        yLimit = 240;
    }
    this.progressTitle = progressTitle;
    this.wankRequired = wankRequired;
    this.dialogLines = dialogLines;
    this.musicFilename = musicFilename;
    this.bgFilename = bgFilename;
    this.objectFilename = objectFilename;
    this.background = null;
    this.objectSprite = null;
    this.music = null;
    this.focus = focusPoint;
    this.xLimit = xLimit;
    this.yLimit = yLimit;
    this.resetGame();
};

GameWank.prototype.resetGame = function() {
    this.isAnExample = false;
    this.wankedAmount = 0;
    this.lastDirection = new Vec2(0, 0);
    this.oneDirectionAdded = 0;
    this.oneDirectionLimit = 40;
    this.lastWankPosition = null;
    this.dialog = new Dialog(this.dialogLines);
    this.progress = new Progress(this.progressTitle, 0.0, 0.0);
    this.stateMachine = new StateMachine(['started', 'quit', 'dialog', 'finished']);
    this.drawPos = new Vec2(this.focus.x, this.focus.y);
    this.drawPosFall = 0.0;
}

GameWank.prototype.draw = function(canvas, ctx) {    
    this.background.draw(ctx, 0, 0);
    this.objectSprite.drawRotated(ctx, this.drawPos.x, this.drawPos.y);
    this.progress.draw(ctx);
    this.dialog.draw(ctx, 100, 200);
};

GameWank.prototype.update = function(timeDelta) {
    this.progress.update(timeDelta);
    if (this.stateMachine.state === 'started') {
        if (this.lastWankPosition) {
            var c = Math.pow(0.99, timeDelta);
            this.drawPos.x = this.drawPos.x * (1.0 - c) + this.lastWankPosition.x * c;
            this.drawPos.y = this.drawPos.y * (1.0 - c) + this.lastWankPosition.y * c;
            this.drawPos.x = Math.min(Math.max(this.drawPos.x, this.focus.x - this.xLimit), this.focus.x + this.xLimit);
            this.drawPos.y = Math.min(Math.max(this.drawPos.y, this.focus.y - this.yLimit), this.focus.y + this.yLimit);
        } else {
            var c = Math.pow(0.85, timeDelta);
            this.drawPos.x = this.drawPos.x * (1.0 - c) + this.focus.x * c;
            this.drawPos.y = this.drawPos.y * (1.0 - c) + this.focus.y * c;
        }
        if (this.progress.finished) {
            this.stateMachine.advance();
        }
    } else if (this.stateMachine.state === 'quit') {
        this.drawPosFall += 0.001 * timeDelta;
        this.drawPos.y += this.drawPosFall * timeDelta;
        if (this.drawPos.y > 1000) {
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
        var currentDirection = new Vec2(0, 0);
        var directionChanged;
        if (this.lastWankPosition !== null) {
            if (!this.xLimit) {
                var xDistance = currentPos.x - this.lastWankPosition.x;
                currentDirection.x = xDistance < 0 ? -1 : 1;
                directionChanged = currentDirection.x !== this.lastDirection.x;
                if (directionChanged) {
                    // Reset one-way-wank limiter.
                    this.oneDirectionAdded = 0;
                }

                if (this.oneDirectionAdded <= this.oneDirectionLimit) {
                    var absDistance = Math.abs(xDistance);
                    this.progress.add(absDistance / this.wankRequired);
                    this.oneDirectionAdded += absDistance;
                }

                this.lastDirection.x = currentDirection.x;
            }
            if (!this.yLimit) {
                var yDistance = currentPos.y - this.lastWankPosition.y;
                currentDirection.y = yDistance < 0 ? -1 : 1;
                directionChanged = currentDirection.y !== this.lastDirection.y;
                if (directionChanged) {
                    // Reset one-way-wank limiter.
                    this.oneDirectionAdded = 0;
                }
                
                if (this.oneDirectionAdded <= this.oneDirectionLimit) {
                    var absDistance = Math.abs(yDistance);
                    this.progress.add(absDistance / this.wankRequired);
                    this.oneDirectionAdded += absDistance;
                }

                this.lastDirection.y = currentDirection.y;
            }
        }
        this.lastWankPosition = currentPos;
    }
};  

GameWank.prototype.mouseup = function(event) {
    this.clickHeld = false;
    if (this.stateMachine.state === 'started') {
        this.lastDirection = new Vec2(0, 0);
        this.lastWankPosition = null;
        this.oneDirectionAdded = 0;
    }
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