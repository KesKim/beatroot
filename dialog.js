var Dialog = function(lines) {
    this.lines = lines;
    this.currentLine = -1;
    this.minChangeInterval = 500;
    this.reset();
};

Dialog.prototype.reset = function() {
    this.time = 0;
    this.lastChangeTime = 0;
    this.finished = false;
    this.started = false;    
    this.opacityReduction = 0.0;
    this.fadeInSecondsRemaining = 0.0;
};

Dialog.prototype.click = function() {
    this.clicked = true;
};

Dialog.prototype.start = function() {
    this.started = true;
    this.advance();
};

Dialog.prototype.update = function(timeDelta) {
    this.time += timeDelta;
    if (this.clicked && !this.finished) {
        this.clicked = false;
        if (this.time > this.lastChangeTime + this.minChangeInterval) {
            this.advance();
        }

        if ( this.fadeInSecondsRemaining > 0.0 ) {
            this.fadeInSecondsRemaining -= timeDelta;

            var opacityPercent = this.fadeInSecondsRemaining / this.originalFadeDuration;
            this.opacity = opacityPercent;
        } else if ( this.fadeInSecondsRemaining <= 0.0 ) {
            this.fadeInSecondsRemaining = 0.0;
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
;
            ctx.globalAlpha = this.opacity;
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
        this.currentLine--;
    }

    this.checkForFade();
};

Dialog.prototype.checkForFade = function() {
    var doBlankScreen = (typeof(this.lines[this.currentLine]) != 'string');
    this.currentIsFadingIn = true;

    if ( doBlankScreen === true )
    {
        this.originalFadeDuration = 1.0;
        this.fadeInSecondsRemaining = 1.0;
    }
}