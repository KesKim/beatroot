var developerMode = true;

var gameCanvas;
var gameCtx;

var time = {
    current: 0,
    lastFrame: 0,
    start: 0
};

var game = null;

var GameSeries = function() {
    var rockDialog = ["I'm so cool.", "But I'm no King.", 'I lack the... ', 'FIRE of passion.'];
    var jungleDialog = ['...', 'I feel like my life should have a higher purpose.', 'I gotta go deeper.'];
    var ancientDialog = ['Oh my word!', 'What IS that in the distance?', 'It\'s getting closer!'];
    var ancientHitSfx = ['lintuosuma.ogg'];
    var ancientThrowSfx = ['keihas.ogg'];
    var ancientMusic = ['metsastys.ogg'];
    var franceDialog = ['Lololol.','Lol.'];
    var franceHitSfx = ['absinthe-glass.wav'];
    var franceThrowSfx = ['keihas.ogg'];
    var franceMusic = ['absinthe.ogg'];

    this.games = [
        new GameDubstep(),
        new GameWank('Street cred', 1000, rockDialog, ['rockabilly.ogg'], 'bg-rock.png', 'comb.png', new Vec2(400, 180), 0, 100, ['comb.ogg']),
        new GameThrow(franceThrowSfx, franceHitSfx, new Vec2(320, 160), franceDialog, franceMusic, 'Decadence', 'bottle.png', 'bg-bohemian.png', 'thrown.png', 82, 366, 'bottlethrow.png', 'bird.png', 500, 300, 300, false, 0.20),
        new GameWank('Ignition', 5000, jungleDialog, ['jungle.ogg'], 'bg-jungle.png', 'firethingy.png', new Vec2(320, 160), 140, 0, ['woodrub.ogg']),
        new GameThrow(ancientThrowSfx, ancientHitSfx, new Vec2(320, 160), ancientDialog, ancientMusic, 'Self Confidence', 'spear.png','bg-ancient.png','thrown.png', 47, 366, 'spearthrow.png','bird.png', -100, 600, 70, true, 0.45),
        new Game()
    ];

    this.fade = 0.0;
    this.fadeDelta = 0.0;
    this.nextGame = null;
    this.currentGame = null;
    this.gameIndex = -1;
    this.toNextGame();
    
    var that = this;
    
    var mouseDown = function(ev) {
        if (that.currentGame !== null) {
            ev.canvasCoords = getRelativeCoords(ev, gameCanvas);
            that.currentGame.mousedown(ev);
        }
        ev.preventDefault();
    };
    var mouseMove = function(ev) {
        if (that.currentGame !== null) {
            ev.canvasCoords = getRelativeCoords(ev, gameCanvas);
            that.currentGame.mousemove(ev);
        }
        ev.preventDefault();
    };
    var mouseUp = function(ev) {
        if (that.currentGame !== null) {
            ev.canvasCoords = getRelativeCoords(ev, gameCanvas);
            that.currentGame.mouseup(ev);
        }
        ev.preventDefault();
    };
    var mouseOut = function(ev) {
        if (ev.relatedTarget !== undefined && (ev.relatedTarget === gameCanvas || ev.relatedTarget === gameCanvasContainer)) {
            ev.preventDefault();
            return;
        }
        if (that.currentGame !== null) {
            ev.canvasCoords = getRelativeCoords(ev, gameCanvas);
            that.currentGame.mouseup(ev);
        }
        ev.preventDefault();
    };
    gameCanvasContainer.addEventListener('mousedown', mouseDown);
    gameCanvasContainer.addEventListener('mousemove', mouseMove);
    gameCanvasContainer.addEventListener('mouseup', mouseUp);
    gameCanvasContainer.addEventListener('mouseout', mouseOut);
};

GameSeries.prototype.toNextGame = function(doFade) {
    this.gameIndex++;
    if (this.gameIndex < this.games.length) {
        this.changeGame(this.games[this.gameIndex], doFade);
    } else {
        this.gameIndex = this.games.length - 1;
        console.log('Tried to progress beyond the last game');
    }
};

GameSeries.prototype.toPreviousGame = function(doFade) {
    this.gameIndex--;
    if (this.gameIndex >= 0) {
        this.changeGame(this.games[this.gameIndex], doFade);
    } else {
        this.gameIndex = 0;
        console.log('Tried to progress beyond the first game');
    }
};

GameSeries.prototype.changeGame = function(to, doFade) {
    if (to === undefined) {
        return;
    }

    if (doFade === undefined) {
        doFade = true;
    }

    if (doFade) {
        this.nextGame = to;
        this.fadeDelta = -2.0;
    } else {
        this.nextGame = null;
        if (this.currentGame.cleanUp !== undefined) {
            this.currentGame.cleanUp();
        }
        this.currentGame = to;
        this.fade = 1.0;
        this.fadeDelta = 0.0;

        if (this.currentGame.startGame !== undefined) {
            this.currentGame.startGame();
        }
    }
};

GameSeries.prototype.draw = function(canvas, ctx) {
    if (this.currentGame !== null) {
        this.currentGame.draw(canvas, ctx);
    }
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1.0 - this.fade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
};

GameSeries.prototype.update = function(timeDelta) {
    if (this.currentGame !== null) {
        this.currentGame.update(timeDelta);
        if (this.currentGame.isFinished() && this.nextGame === null) {
            this.toNextGame();
        }
    }
    this.fade += this.fadeDelta * timeDelta * 0.001;
    if (this.fade < 0) {
        this.fade = 0;
        if (this.nextGame !== null) {
            if (this.currentGame !== null && this.currentGame.cleanUp !== undefined) {
                this.currentGame.cleanUp();
            }
            this.currentGame = this.nextGame;
            this.nextGame = null;
            this.fadeDelta = 2.0;

            if (this.currentGame.startGame !== undefined) {
                this.currentGame.startGame();
            }
        }
    }
    if (this.fade > 1.0) {
        this.fade = 1.0;
        this.fadeDelta = 0;
    }
};

GameSeries.prototype.loadAll = function() {
    for (var i = 0; i < this.games.length; ++i) {
        this.games[i].load();
    }
};

function doFrame() {
    time.current = Date.now(); 
    var timeDelta = time.current - time.lastFrame;
    if (timeDelta > 10) { // don't bother with drawing frames that are too close to each other
        time.lastFrame = time.current;
        gameSeries.update(timeDelta);
        gameSeries.draw(gameCanvas, gameCtx);
    }
    requestAnimationFrame(doFrame);
}

function init() {
    gameCanvasContainer = document.createElement('div');
    gameCanvasContainer.id = 'gameContainer';
    gameCanvas = document.createElement('canvas');
    gameCanvas.id = 'game';
    gameCanvas.width = 640;
    gameCanvas.height = 480;
    gameCtx = gameCanvas.getContext('2d');
    gameCanvasContainer.appendChild(gameCanvas);
    document.body.appendChild(gameCanvasContainer);
    startTime = Date.now(); 
    lastFrameTime = Date.now();

    gameSeries = new GameSeries();
    gameSeries.loadAll();

    if (developerMode) {
        var gameChanger2 = document.createElement('input');
        gameChanger2.type = 'button';
        gameChanger2.value = 'Previous game';
        gameChanger2.addEventListener('click', function() {
            gameSeries.toPreviousGame(false);
        });
        document.body.appendChild(gameChanger2);
        var gameChanger = document.createElement('input');
        gameChanger.type = 'button';
        gameChanger.value = 'Next game';
        gameChanger.addEventListener('click', function() {
            gameSeries.toNextGame(false);
        });
        document.body.appendChild(gameChanger);
    }

    requestAnimationFrame(doFrame);
}