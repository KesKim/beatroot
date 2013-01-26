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
    var thisLine = this.lines[this.currentLine];
    var thisIsBlackScreen = (typeof(thisLine) != 'string');
    console.log('This is black: ' + thisIsBlackScreen);
    console.log(thisLine);

    var nextLineIndex = this.currentLine + 1;
    var lastIndex = this.lines.length - 1;
    
    if ( nextLineIndex > lastIndex ) {
        nextLineIndex = lastIndex;
    }

    var nextLine = this.lines[nextLineIndex];
    var nextIsClearScreen = (typeof(nextLine) == 'string');
    console.log('Next is clear: ' + nextIsClearScreen);
    console.log(nextLine);

    if ( thisIsBlackScreen ) {
        this.opacity = 1.0;

        if ( nextLine && nextIsClearScreen === true ) {
            console.log('Start fade, next is: ' + nextLine);
            this.startFade();
        }
    }
}

Dialog.prototype.startFade = function() {
    console.log('Starting fade with next transition.');
    this.fadeWhenChangingLine = true;
}