var GameThrow = function() {
    this.mouseDown = false;
    this.mouseUp = true;
    this.powerMeter = 0;
    this.throwableArray = [];
    this.bg = null;
    this.coordinates = null;
    this.currentVelX = 0;
    this.currentVelY = 0;
    this.angleRadians = 0;
    this.startPointX = 125;
    this.startPointY = 310;
    this.characterArmThrown = null;
    this.characterArmCharge = null;
    this.throwDelayElapsed = 0;
    this.throwDelay = 2000;
    this.armRotation = -0.5;
};

GameThrow.prototype.resetGame = function() {
    // Clear the projectile array
    this.throwableArray = [];
}

GameThrow.prototype.draw = function(canvas, ctx) {
    // Draw background
    this.bg.draw(ctx, 0, 0);

    // Draw projectiles
    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].draw(canvas, ctx);
    };


    if (developerMode)
    {
        // Debug Texts
        ctx.fillStyle = 'red';
        ctx.fillText('Power: ' + this.powerMeter, 20, 20);

        if (this.coordinates != null)
        {
            ctx.fillText('Mouse X: ' + this.coordinates.x, 20, 40);
            ctx.fillText('Mouse Y: ' + this.coordinates.y, 20, 60);
            ctx.fillText('Velocity: ' + this.currentVelX + ', ' + this.currentVelY, 20, 80);
            ctx.fillText('Angle: ' + this.angleRadians, 20, 100);
            ctx.fillText('MouseDown: ' + this.mouseDown, 20, 120);
            ctx.fillText('MouseUp: ' + this.mouseUp, 20, 140);
            ctx.fillText('Delay: ' + this.throwDelayElapsed, 20, 160);
        }
    }

    ctx.fillStyle = 'black';

    if (this.throwDelayElapsed < this.throwDelay)
    {
         ctx.fillText('Picking up spear... ' + Math.round(this.throwDelayElapsed / this.throwDelay * 100) + '%', 10, 300);   
    }
    
    if (this.coordinates !== null) {
        this.armRotation = Math.atan2(this.startPointY - this.coordinates.y, this.startPointX - this.coordinates.x) + Math.PI;
    }

    // "Animation"
    if (this.mouseUp)
    {
        this.characterArmThrown.drawRotated(ctx, 47, 366);
    }

    if (this.mouseDown)
    {
        this.characterArmCharge.drawRotated(ctx, 47, 366, this.armRotation);
    }

};

GameThrow.prototype.update = function(timeDelta) {

    // Update projectiles
    for (var i = this.throwableArray.length - 1; i >= 0; i--) {
        this.throwableArray[i].update();
    };

    // Charge throw power
    if (this.mouseDown)
    {
        if (this.powerMeter < 15)
        {
            this.powerMeter += 0.5; 
        }
    }

    // Add the elapsed time to the timer
    this.throwDelayElapsed += timeDelta;
};

GameThrow.prototype.mousedown = function(event) {
    // Start throw process if push event coordinates in the allowed zone, and the timeout has expired
    if (event.canvasCoords.x > 46 && event.canvasCoords.y < 366 && this.throwDelayElapsed > this.throwDelay)
    {
        this.mouseDown = true;  
        this.mouseUp = false;
    }
};

GameThrow.prototype.mousemove = function(event) {
    this.coordinates = event.canvasCoords;
};

GameThrow.prototype.mouseup = function(event) {
    if (this.mouseDown)
    {
        // Calculate the angle of attack
        var mouseCoords = event.canvasCoords;
        var angle = Math.atan((this.startPointY - mouseCoords.y) / (this.startPointX - mouseCoords.x));

        if (angle > 0)
            angle = 0;

        if (angle < -1.4)
            angle = -1.4;

        this.angleRadians = angle;
        this.mouseDown = false;

        // Create new projectile
        var throwableItem = new GameObject('spear.png', 46, 366);
        throwableItem.load();
        throwableItem.velX = this.powerMeter * Math.cos(angle);
        throwableItem.velY = this.powerMeter * Math.sin(angle);

        // Debug velocities
        this.currentVelX = throwableItem.velX;
        this.currentVelY = throwableItem.velY;

        // Clear the array if max limit reached
        if (this.throwableArray.length > 30)
        {
            this.throwableArray = [];
        }

        this.throwableArray.push(throwableItem);
        this.throwDelayElapsed = 0;
    }

    // Reset power
    this.powerMeter = 0;
    this.mouseUp = true;
};

GameThrow.prototype.load = function() {
    // Load graphics
    this.bg = new Sprite('bg-ancient.png');
    this.characterArmThrown = new Sprite('thrown.png');
    this.characterArmCharge = new Sprite('spearthrow.png');
};

GameThrow.prototype.isFinished = function() {
    return false;
};

GameThrow.prototype.cleanUp = function() {
    this.resetGame();
};