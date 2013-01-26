var Dialog = function(lines) {
    this.lines = lines;
    this.currentLine = 0;
    this.minChangeInterval = 500;
    this.reset();
};

Dialog.prototype.reset = function() {
    this.time = 0;
    this.lastChangeTime = 0;
    this.finished = false;
    this.started = false;    
};

Dialog.prototype.click = function() {
    this.clicked = true;
};

Dialog.prototype.start = function() {
    this.started = true;
};

Dialog.prototype.update = function(timeDelta) {
    this.time += timeDelta;
    if (this.clicked && !this.finished) {
        this.clicked = false;
        if (this.time > this.lastChangeTime + this.minChangeInterval) {
            this.advance();
        }
    }
};

Dialog.prototype.draw = function(ctx, x, y) {
    if (!this.finished && this.started) {

        var nextLine = this.lines[this.currentLine];
        var doBlankScreen = (typeof nextLine != 'string');

        if ( doBlankScreen === true )
        {
            ctx.fillStyle = nextLine.blankScreenColor;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            nextLine = nextLine.text;
        }

        ctx.font = '18px sans-serif';
        ctx.globalAlpha = 0.7;
        var measurement = ctx.measureText(this.lines[this.currentLine]);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, measurement.width + 20, 30);
        ctx.fillStyle = 'white';
        ctx.fillText(nextLine, x + 10, y + 20);
        ctx.globalAlpha = 1.0;
    }
};

Dialog.prototype.advance = function() {
    this.currentLine++;
    if (this.currentLine >= this.lines.length) {
        this.finished = true;
    }
};