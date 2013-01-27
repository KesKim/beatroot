var GameThrow = function(throwSfxFilename, hitSfxFilename, focusPoint, dialog, urlMusic, progressTitleString, urlProjectile, urlBg, urlCharacterArmThrown, armPosX, armPosY, urlCharacterArmCharge, urlEnemy, enemyStartpoint, enemyEndpoint, enemyHeight, moveEnemy, progressAddAmount, progessDecayRate, maximumPower, powerIncrease) {
    this.mouseDown = false;
    this.mouseUp = true;
    this.powerMeter = 0;
    this.throwableArray = [];
    this.enemyArray = [];
    this.bg = null;
    this.urlImgBg = urlBg;
    this.coordinates = null;
    this.currentVelX = 0;
    this.currentVelY = 0;
    this.armRotation = -0.5;
    this.startPoint = new Vec2(80, 300);
    this.armPoint = new Vec2(armPosX, armPosY);
    this.startPointX = 125;
    this.startPointY = 310;
    this.urlImgCharacterArmThrown = urlCharacterArmThrown;
    this.urlImgCharacterArmCharge = urlCharacterArmCharge;
    this.characterArmThrown = null;
    this.characterArmCharge = null;
    this.throwDelayElapsed = 0;
    this.throwDelay = 500;
    this.projectile = new Sprite(urlProjectile);
    this.deltaTimeDebug = 0;
    this.enemyTurnpoint1 = enemyStartpoint;
    this.enemyTurnpoint2 = enemyEndpoint;
    this.enemySprite = new Sprite(urlEnemy);
    this.enemyOnScreen = false;
    this.projectilePositionX = 0;
    this.projectilePositionY = 0;
    this.progress = null;
    this.progressDecayRate = progessDecayRate;
    this.progressTitle = progressTitleString;
    this.musicFilename = urlMusic;
    this.music = null;
    this.dialog = dialog;
    this.stateMachine = null;
    this.canvasWidth = 0;
    this.focus = focusPoint;
    this.throwSfxFilename = throwSfxFilename;
    this.hitSfxFilename = hitSfxFilename;
    this.hitSfx = null;
    this.throwSfx = null;
    this.moveEnemy = moveEnemy;
    this.enemyHeight = enemyHeight;
    this.progressAddAmount = progressAddAmount;
    this.maximumPower = maximumPower;
    this.powerIncrease = powerIncrease;
    this.resetGame();
};

GameThrow.prototype.resetGame = function() {
    // Clear the projectile array
    this.throwableArray = [];
    this.enemyArray = [];
    this.progress = new Progress(this.progressTitle, 0, 0, this.progressDecayRate);
    this.stateMachine = new StateMachine(['started', 'quit', 'dialog', 'finished']);
    this.dialog.reset();
    this.drawPos = new Vec2(this.focus.x, this.focus.y);
    this.drawPosFall = 0.0;
}

GameThrow.prototype.draw = function(canvas, ctx) {

    // Draw background
    this.bg.draw(ctx, 0, 0);
    this.canvasWidth = canvas.width;

    this.progress.draw(ctx);

    // Draw projectiles
    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].draw(canvas, ctx);
    };

    // Draw enemies
    for (var i = this.enemyArray.length - 1; i >= 0; i--) {
        this.enemyArray[i].draw(canvas, ctx);
    };


    // if (developerMode)
    // {
    //     // Debug Texts
    //     ctx.fillStyle = 'red';
    //     ctx.fillText('Power: ' + this.powerMeter, 20, 20);

    //     if (this.coordinates != null)
    //     {
    //         ctx.fillText('Mouse X: ' + this.coordinates.x, 20, 40);
    //         ctx.fillText('Mouse Y: ' + this.coordinates.y, 20, 60);
    //         ctx.fillText('Velocity: ' + this.currentVelX + ', ' + this.currentVelY, 20, 80);
    //         ctx.fillText('MouseDown: ' + this.mouseDown, 20, 120);
    //         ctx.fillText('MouseUp: ' + this.mouseUp, 20, 140);
    //         ctx.fillText('Delay: ' + this.throwDelayElapsed, 20, 160);
    //         ctx.fillText('Delta: ' + this.deltaTimeDebug, 20, 180);
    //         ctx.fillRect(this.projectilePositionX,this.projectilePositionY,5,5);
    //     }
    // }
    
    console.log(this.powerMeter);
    
    if (this.coordinates !== null) {
        var throwSimulation = this.generateThrowable(this.coordinates);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3.0;
        for (var i = 0; i < 32; ++i) {
            ctx.globalAlpha = 0.5 * Math.min(this.powerMeter / this.maximumPower * 1.5, 1.0) * Math.sin(i / 32 * Math.PI);
            throwSimulation.update(16);
            if (i > 0) {
                ctx.lineTo(throwSimulation.posX, throwSimulation.posY);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(throwSimulation.posX, throwSimulation.posY);
        }
        ctx.globalAlpha = 1.0;
    }
    ctx.fillStyle = 'black';
    
    if (this.coordinates !== null) {
        this.armRotation = Math.atan2(this.armPoint.y - this.coordinates.y, this.armPoint.x - this.coordinates.x) + Math.PI;
    }

    // "Animation"
    if (this.mouseUp && this.throwDelayElapsed <= this.throwDelay) {
        this.characterArmThrown.drawRotated(ctx, this.armPoint.x, this.armPoint.y, this.armRotation);
    } else {
        this.characterArmCharge.drawRotated(ctx, this.armPoint.x, this.armPoint.y, this.armRotation);
    }

    this.dialog.draw(ctx, 100, 200);
};

GameThrow.prototype.update = function(timeDelta) {

    this.progress.update(timeDelta);
    if (this.stateMachine.state === 'started') {
        // Add the elapsed time to the timer
        this.throwDelayElapsed += timeDelta;

        this.deltaTimeDebug = timeDelta;

        // Update projectiles
        for (var i = this.throwableArray.length - 1; i >= 0; i--) {
            this.throwableArray[i].update(timeDelta);
        };

        // Update enemies
        for (var j = this.enemyArray.length - 1; j >= 0; j--) {
            this.enemyArray[j].update(timeDelta, this.enemyTurnpoint1, this.enemyTurnpoint2);
            if (this.enemyArray[j].destroyed)
            {
                this.enemyArray.pop();
                this.progress.add(this.progressAddAmount);
                this.hitSfx.play();
            }
        };

        for (var k = this.throwableArray.length - 1; k >= 0; k--) {
            for (var l = this.enemyArray.length - 1; l >= 0; l--) {
                var proj = this.throwableArray[k];

                this.projectilePositionX = proj.posX;
                this.projectilePositionY = proj.posY;

                this.enemyArray[l].isColliding(proj.posX, proj.posY);
            };
        };

        this.progress.update(timeDelta);

        // Charge throw power
        if (this.mouseDown)
        {
            if (this.powerMeter < this.maximumPower )
            {
                this.powerMeter += this.powerIncrease; 
            }
        }

        if (this.enemyArray.length > 0)
        {
            this.enemyOnScreen = true;
        }
        else
        {
            this.enemyOnScreen = false;
        }

        if (!this.enemyOnScreen)
        {
            var newEnemy = new Enemy(this.enemySprite, this.enemyTurnpoint1, this.enemyHeight, this.moveEnemy);
            this.enemyArray.push(newEnemy);
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

GameThrow.prototype.mousedown = function(event) {

    if (this.stateMachine.state === 'started') {
        // Start throw process if push event coordinates in the allowed zone, and the timeout has expired
        if (event.canvasCoords.x > this.armPoint.x && event.canvasCoords.y < this.armPoint.y && this.throwDelayElapsed > this.throwDelay)
        {
            this.mouseDown = true;  
            this.mouseUp = false;
        }
    } else if (this.stateMachine.state === 'dialog') {
        this.dialog.click();
    }
};

GameThrow.prototype.mousemove = function(event) {

    if (this.stateMachine.state === 'started')
    {
        this.coordinates = event.canvasCoords;
    }
};

GameThrow.prototype.generateThrowable = function(mouseCoords) {
    // Calculate the angle of attack
    var angle = Math.atan((this.armPoint.y - mouseCoords.y) / (this.armPoint.x - mouseCoords.x));
    if (angle > 0) {
        angle = 0;
    }
    if (angle < -1.3) {
        angle = -1.3;
    }
    // Create new projectile
    var throwableItem = new GameObject(this.projectile, this.startPoint.x, this.startPoint.y);
    throwableItem.velX = this.powerMeter * Math.cos(angle);
    throwableItem.velY = this.powerMeter * Math.sin(angle);
    // Debug velocities
    this.currentVelX = throwableItem.velX;
    this.currentVelY = throwableItem.velY;
    return throwableItem;
}

GameThrow.prototype.mouseup = function(event) {

    if (this.stateMachine.state === 'started') {
        if (this.mouseDown) {
            var throwable = this.generateThrowable(event.canvasCoords);
            // Clear the array if max limit reached
            if (this.throwableArray.length > 30) {
                this.throwableArray = [];
            }
            this.throwableArray.push(throwable);
            this.throwDelayElapsed = 0;
            this.throwSfx.play();
            this.mouseDown = false;
        }

        // Reset power
        this.powerMeter = 0;
        this.mouseUp = true;
    }
};

GameThrow.prototype.load = function() {
    // Load graphics
    this.bg = new Sprite(this.urlImgBg);
    this.characterArmThrown = new Sprite(this.urlImgCharacterArmThrown);
    this.characterArmCharge = new Sprite(this.urlImgCharacterArmCharge);
    this.hitSfx = new Audio(this.hitSfxFilename);
    this.throwSfx = new Audio(this.throwSfxFilename);

    if (this.musicFilename !== null) {
        this.music = new Audio(this.musicFilename, true);
    }
};

GameThrow.prototype.isFinished = function() {
    return this.stateMachine.state === 'finished';
};

GameThrow.prototype.cleanUp = function() {
    this.resetGame();
    if (this.music !== null) {
        this.music.stop();
    }
};

GameThrow.prototype.startGame = function() {
    if (this.music !== null) {
        this.music.play();
    }
}