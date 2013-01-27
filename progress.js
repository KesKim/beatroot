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
        this.finished = true;
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
};