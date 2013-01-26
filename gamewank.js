var GameWank = function() {
	console.log('Initiating: GameWank. Shake mouse horizontally.');
    this.isAnExample = false;
    this.background = null;
    this.wankedAmount = 0;
    this.wankRequired = 1000;
    this.lastDirection = 0;
    this.oneDirectionAdded = 0;
    this.oneDirectionLimit = 50;
};

GameWank.prototype.draw = function(canvas, ctx) {
	ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

	var drawPosX = this.lastWankPosition ? this.lastWankPosition.x : (canvas.width / 2);
	var drawPosY = this.lastWankPosition ? this.lastWankPosition.y : (canvas.height / 2);
	this.background.draw(ctx, drawPosX - (this.background.width / 2), drawPosY - (this.background.height / 2));

    ctx.fillStyle = 'red';
    ctx.fillText(this.wankedAmount, 10, 10);
};

GameWank.prototype.update = function(timeDelta) {
	if ( this.clickHeld === true )
	{
	}
};

GameWank.prototype.mousedown = function(event) {
	this.clickHeld = true;
	this.lastWankPosition = event.canvasCoords;
};

GameWank.prototype.mousemove = function(event) {
	if ( this.clickHeld === true )
	{
		var currentPos = event.canvasCoords;

		var xDistance = currentPos.x - this.lastWankPosition.x;

        var currentDirection = xDistance < 0 ? -1 : 1;

		var directionChanged = currentDirection !== this.lastDirection;

		if ( directionChanged === true )
		{
            console.log('direction just changed');
			// Reset one-way-wank limiter.
			this.oneDirectionAdded = 0;
		}

        console.log('Latest distance traveled: ' + xDistance);

		if ( this.oneDirectionAdded <= this.oneDirectionLimit )
		{
            var absDistance = Math.abs(xDistance);
			this.wankedAmount += absDistance;
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
	this.background = new Sprite('350x150.gif');
};

GameWank.prototype.isFinished = function() {
	if ( this.wankedAmount >= this.wankRequired )
		return true;
	else
    	return false;
};

GameWank.prototype.cleanUp = function() {
};