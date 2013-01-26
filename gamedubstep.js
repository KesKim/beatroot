var GameDubstep = function() {
    this.cleanUp();
};

GameDubstep.prototype.draw = function(canvas, ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
};

GameDubstep.prototype.createSlider = function(parent, id, displayName) {
    if (displayName === undefined) {
        displayName = id;
    }
    var control = document.createElement('div');
    parent.appendChild(control);
    var label = document.createElement('label');
    label.innerHTML = displayName;
    var input = document.createElement('input');
    input.type = 'range';
    input.name = id;
    input.min = 0;
    input.max = 11;
    input.value = 11;
    input.disabled = 'disabled';
    control.appendChild(label);
    control.appendChild(input);
    control.appendChild(document.createTextNode('' + input.value));
    return input;
};

GameDubstep.prototype.createCheckbox = function(parent, id, displayName) {
    if (displayName === undefined) {
        displayName = id;
    }
    var control = document.createElement('div');
    parent.appendChild(control);
    var label = document.createElement('label');
    label.innerHTML = displayName;
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.name = id;
    input.checked = false;
    control.appendChild(input);
    control.appendChild(label);
    return input;
};

GameDubstep.prototype.update = function(timeDelta) {
    if (!this.initialized) {
        this.initTimer += timeDelta;
        if (this.initTimer > 2000) {
            var that = this;
            this.dubstepEditor = document.createElement('div');
            this.dubstepEditor.id = 'dubstepEditor';
            var title = document.createElement('h2');
            title.innerHTML = 'DubstepMaker Creative 2017';
            this.dubstepEditor.appendChild(title);
            var expertSettings = this.createCheckbox(this.dubstepEditor, 'Expert settings');
            expertSettings.onclick = function() { 
                alert('To enable expert settings, you need to purchase the full version of DubstepMaker Creative 2017.');
                expertSettings.checked = false;
                that.clicks++; };
            this.createSlider(this.dubstepEditor, 'WUB');
            this.createSlider(this.dubstepEditor, 'AutoTune&trade;');
            var butan = document.createElement('input');
            butan.type = 'button';
            butan.value = 'Create dubstep';
            butan.onclick = function() {
                that.clicks++;
            };
            this.dubstepEditor.appendChild(butan);
            this.initialized = true;
            document.body.appendChild(this.dubstepEditor);
        }
    }
    
    if (this.clicks > 10) {
        this.finished = true;
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
    if (this.dubstepEditor !== null && this.dubstepEditor !== undefined) {
        document.body.removeChild(this.dubstepEditor);
    }
    this.dubstepEditor = null;
    this.initialized = false;
    this.initTimer = 0;
    this.clicks = 0;
    this.finished = false;
};