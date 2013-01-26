var Progress = function(title, minProgress, progress) {
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
};

Progress.prototype.update = function(timeDelta) {
    if (this.progress < 1.0) {
        this.progress = this.minProgress + (this.progress - this.minProgress) * Math.pow(0.9, timeDelta * 0.001);
    }
};

Progress.prototype.add = function(addition) {
    this.progress += addition;
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
    ctx.fillStyle = 'red';
    ctx.fillRect(120, 10, this.progress * 500, 10);
    ctx.fillStyle = 'white';
    ctx.fillText(this.title, 10, 20);
    ctx.globalAlpha = 1.0;
};