var GameWank = function() {
	console.log('Initiating: GameWank. Shake mouse horizontally.');
    this.isAnExample = false;
    this.background = null;
    this.wankedAmount = 0;
    this.wankRequired = 100;
    this.oneWayLimit = 15;
    this.oneWayWank = 0;
};

GameWank.prototype.draw = function(canvas, ctx) {
	ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

	var drawPosX = this.lastWankPosition ? this.lastWankPosition.x : (canvas.width / 2);
	var drawPosY = this.lastWankPosition ? this.lastWankPosition.y : (canvas.height / 2);
	this.background.draw(ctx, drawPosX - (this.background.width / 2), drawPosY - (this.background.height / 2));
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
		console.log('Latest distance traveled: ' + xDistance);

		if ( this.oneWayLimit == null )
		{
			if ( xDistance < 0 )
				this.oneWayLimit = -15;
			else
				this.oneWayLimit = 15;
		}

		if ( xDistance < 0 )
		{
			if ( this.oneWayWank >= this.oneWayLimit )
			{
				
			}
		}

		this.lastWankPosition = currentPos
	}
};	

GameWank.prototype.mouseup = function(event) {
	this.clickHeld = false;
	this.lastWankPosition = null;
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