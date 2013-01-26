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
    var jungleDialog = ['I feel like my life should have a higher purpose.', '...', 'I gotta go deeper.'];
    this.games = [
        new GameDubstep(),
        new GameWank('Satiation', 3000, jungleDialog, null, 'bg-jungle.png', '350x150.gif', new Vec2(320, 160), false, true),
        new GameThrow(),
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

            console.log('Fade end, game start');

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