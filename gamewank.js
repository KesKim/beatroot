var GameWank = function() {
    this.isAnExample = false;
    this.background = null;
};

GameWank.prototype.draw = function(canvas, ctx) {
	this.background.draw(ctx, (canvas.width / 2) - (this.background.width / 2), (canvas.height / 2) - (this.background.height / 2));
};

GameWank.prototype.update = function(timeDelta) {
};

GameWank.prototype.mousedown = function(event) {
	this.clickHeld = true;
};

GameWank.prototype.mousemove = function(event) {
};

GameWank.prototype.mouseup = function(event) {
};

GameWank.prototype.load = function() {
	this.background = new Sprite('350x150.gif');
};