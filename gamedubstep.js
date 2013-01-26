var GameDubstep = function() {
    this.initialized = false;
    this.initTimer = 0;
    this.finished = false;
    this.dubstepEditor = null;
};

GameDubstep.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
};

GameDubstep.prototype.createSlider = function(id, displayName) {
    if (displayName === undefined) {
        displayName = id;
    }
    var control = document.createElement('div');
    var label = document.createElement('label');
    label.innerHTML = displayName;
    var input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 11;
    input.value = 11;
    input.disabled = 'disabled';
    control.appendChild(label);
    control.appendChild(input);
    control.appendChild(document.createTextNode('' + input.value));
    return control;
}

GameDubstep.prototype.update = function(timeDelta) {
    if (!this.initialized) {
        this.initTimer += timeDelta;
        if (this.initTimer > 2000) {
            this.dubstepEditor = document.createElement('div');
            this.dubstepEditor.id = 'dubstepEditor';
            var title = document.createElement('h2');
            title.innerHTML = 'Dubstep It Up';
            this.dubstepEditor.appendChild(title);
            this.dubstepEditor.appendChild(this.createSlider('WUB'));
            this.dubstepEditor.appendChild(this.createSlider('AutoTune&trade;'));
            document.body.appendChild(this.dubstepEditor);
            this.initialized = true;
        }
    }
};

GameDubstep.prototype.mousedown = function(event) {
};

GameDubstep.prototype.mousemove = function(event) {
};

GameDubstep.prototype.mouseup = function(event) {
};

GameDubstep.prototype.load = function() {
    this.balls = new Sprite('350x150.gif');
};

GameDubstep.prototype.isFinished = function() {
    return this.finished;
};

GameDubstep.prototype.cleanUp = function() {
    if (this.dubstepEditor !== null) {
        document.body.removeChild(this.dubstepEditor);
    }
    this.dubstepEditor = null;
    this.initialized = false;
    this.initTimer = 0;
};