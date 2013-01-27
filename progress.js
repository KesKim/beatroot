var Progress = function(title, minProgress, progress, decayRate) {
    if (minProgress === undefined) {
        minProgress = 0;
    }
    if (progress === undefined) {
        progress = 0.5;
    }
    this.minProgress = minProgress;
    this.title = title;
    this.progress = progress;
    this.finished = false;
    this.addFade = 0.0;

    this.decayRate = 0.001;

    if ( decayRate )
        this.decayRate = decayRate;
};

Progress.prototype.update = function(timeDelta) {
    if (this.progress < 1.0) {
        this.progress = this.minProgress + (this.progress - this.minProgress) * Math.pow(0.9, timeDelta * this.decayRate);
    }
    this.addFade -= Math.min(timeDelta, 50) * 0.0017;
    if (this.addFade < 0) {
        this.addFade = 0;
    }
};

Progress.prototype.add = function(addition) {
    this.progress += addition;
    this.addFade += Math.pow(addition, 0.55) * 2.0;
    if (this.addFade > 1) {
        this.addFade = 1;
    }
    if (this.progress > 1.0) {
        this.progress = 1.0;
        if (!this.finished) {
            this.finished = true;
            this.finishTime = time.current;
        }
    }
};

Progress.prototype.draw = function(ctx) {
    ctx.font = '18px sans-serif';
    ctx.globalAlpha = 0.7;
    var measurement = ctx.measureText(this.title);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 640, 30);
    ctx.fillStyle = 'rgb(255, ' + Math.round(this.addFade * 255) + ', ' + Math.round(this.addFade * 255) + ')';
    var thickness = this.addFade * 5 + 10;
    ctx.fillRect(measurement.width + 20, 15 - thickness * 0.5, this.progress * (600 - measurement.width), thickness);
    ctx.fillStyle = 'white';
    ctx.fillText(this.title, 10, 20);
    ctx.globalAlpha = 1.0;

    if (this.finished)
    {
        ctx.font = '32px sans-serif';
        var congratulationsText = 'MAXIMUM ' + this.title.toUpperCase() + ' REACHED!';
        ctx.globalAlpha = Math.max(1.0 - (time.current - this.finishTime) * 0.0005, 0.0);
        ctx.fillStyle = 'black';
        ctx.fillText(congratulationsText, 320 - ctx.measureText(congratulationsText).width * 0.5 + 1, 240 - (time.current - this.finishTime) * 0.05 + 1);
        ctx.fillStyle = 'rgb(255, ' + Math.round(Math.sin(time.current * 0.02) * 50 + 205) +', ' + Math.round(Math.sin(time.current * 0.02) * 50 + 205) + ')';
        ctx.fillText(congratulationsText, 320 - ctx.measureText(congratulationsText).width * 0.5, 240 - (time.current - this.finishTime) * 0.05);
        ctx.globalAlpha = 1.0
    }
};