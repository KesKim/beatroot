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
    this.opacity = 0.0;
    this.fadeWhenChangingLine = false;
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

    // Fade handling.
    if ( this.fadeInSecondsRemaining > 0.0 ) {
        this.fadeInSecondsRemaining -= timeDelta;

        var opacityPercent = this.fadeInSecondsRemaining / this.originalFadeDuration;

        if ( opacityPercent < 0.0 ) {
            console.log('Fade over.');
            opacityPercent = 0.0;
        }

        this.opacity = opacityPercent;
    } else if ( this.fadeInSecondsRemaining <= 0.0 ) {
        this.fadeInSecondsRemaining = 0.0;
    }

    // Advancement handling and timing limiters.
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

            ctx.globalAlpha = this.opacity;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            nextLine = nextLine.text;
        } else if ( this.fadeInSecondsRemaining ) {
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        }

        ctx.font = '18px sans-serif';
        ctx.globalAlpha = 0.7;
        var measurement = ctx.measureText(nextLine);
        
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

    if ( this.fadeWhenChangingLine ) {
        this.fadeWhenChangingLine = false;

        // Start a fade.
        console.log('Fade-in from darkened line: ' + this.lines[this.currentLine].text);
        this.originalFadeDuration = 2.5 * 1000.0;
        this.fadeInSecondsRemaining = 2.5 * 1000.0;
        this.opacity = 1.0;
    }

    this.checkForFade();
};

Dialog.prototype.checkForFade = function() {
    var doBlankScreen = (typeof(this.lines[this.currentLine]) != 'string');
    this.currentIsFadingIn = true;

    if ( doBlankScreen === true )
    {
        this.startFade();
    }
}

Dialog.prototype.startFade = function() {
    this.opacity = 1.0;
    this.fadeWhenChangingLine = true;
}