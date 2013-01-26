var GameDubstep = function() {
    this.stateMachine = new StateMachine(['notinitialized', 'initialized', 'frustrated', 'finished']);
    this.music = null;
    this.dialog = null;
    this.cleanUp();
};

GameDubstep.prototype.draw = function(canvas, ctx) {
    this.bg.draw(ctx, 0, 0);
    this.progress.draw(ctx);
    this.dialog.draw(ctx, 100, 300);
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
    var span = document.createElement('span');
    span.appendChild(document.createTextNode('' + input.value));
    control.appendChild(span);
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
    this.stateMachine.update(timeDelta);
    this.progress.update(timeDelta);

    if (this.stateMachine.state === 'notinitialized') {
        if (this.stateMachine.timer > 2000) {
            var that = this;
            this.dubstepEditor = document.createElement('div');
            this.dubstepEditor.id = 'dubstepEditor';
            var title = document.createElement('h2');
            title.innerHTML = 'DubstepMaker Creative 2017 Trial Edition';
            this.dubstepEditor.appendChild(title);
            var expertSettings = this.createCheckbox(this.dubstepEditor, 'Expert settings');
            expertSettings.onclick = function() { 
                alert('To enable expert settings, you need to purchase the full version of DubstepMaker Creative 2017.');
                expertSettings.checked = false;
                if (that.createdDubstep) {
                    that.progress.add(0.15);
                } else {
                    that.progress.add(0.02);
                }
            };
            this.createSlider(this.dubstepEditor, 'WUB');
            this.createSlider(this.dubstepEditor, 'AutoTune&trade;');
            
            var butan = document.createElement('input');
            butan.type = 'button';
            butan.value = 'Create dubstep';
            butan.onclick = function() {
                that.progress.add(0.05);
                that.createdDubstep = true;
                that.music.stop();
                that.music.play();
            };

            this.dubstepEditor.appendChild(butan);
            document.body.appendChild(this.dubstepEditor);
            positionRelativeToCanvas(this.dubstepEditor, (gameCanvas.width - 510) * 0.5, 50);
            this.stateMachine.advance();
        }
    } else if (this.stateMachine.state === 'initialized') {
        if (this.progress.finished) {
            if (this.dubstepEditor !== null && this.dubstepEditor !== undefined) {
                document.body.removeChild(this.dubstepEditor);
                this.dubstepEditor = null;
            }
            this.stateMachine.advance();
            this.dialog.start();
        }
    } else if (this.stateMachine.state === 'frustrated') {
        this.dialog.update(timeDelta);
        if (this.dialog.finished) {
            this.stateMachine.advance();
        }
    }
};

GameDubstep.prototype.mousedown = function(event) {
    this.dialog.click();
};

GameDubstep.prototype.mousemove = function(event) {
};

GameDubstep.prototype.mouseup = function(event) {
};

GameDubstep.prototype.load = function() {
    this.bg = new Sprite('bg-dubstep.png');
    this.music = new Audio(['dubstep_good.mp3', 'dubstep_good.ogg']);
};

GameDubstep.prototype.isFinished = function() {
    return this.stateMachine.state === 'finished';
};

GameDubstep.prototype.cleanUp = function() {
    if (this.dubstepEditor !== null && this.dubstepEditor !== undefined) {
        document.body.removeChild(this.dubstepEditor);
    }
    this.dubstepEditor = null;
    this.initialized = false;
    this.clicks = 0;
    this.createdDubstep = false;
    if ( this.music !== null ) {
        this.music.stop();
    }
    this.stateMachine.reset();
    if (this.dialog !== null) {
        this.dialog.reset();
    }
    this.progress = new Progress('Frustration', 0.5);
    this.dialog = new Dialog(['This is going nowhere...', 'I need a way to regain my inspiration.', 'I need to find the mother of all jams.', 'I must look into my past lives...', '... and find the the origin of all beats.', 'The BEATROOT.']);
};

GameDubstep.prototype.startGame = function() {
};
