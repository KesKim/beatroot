var canvas;
var gameCtx;

var time = {
    current: 0,
    lastFrame: 0,
    start: 0
};

var game = null;

var GameSeries = function() {
    this.games = [
        //new GameWank(),
        new Game()
    ];
    this.fade = 0.0;
    this.fadeDelta = 0.0;
    this.nextGame = null;
    this.currentGame = null;
    this.gameIndex = -1;
    this.toNextGame();
};

GameSeries.prototype.toNextGame = function() {
    this.gameIndex++;
    if (this.gameIndex < this.games.length) {
        this.changeGame(this.games[this.gameIndex]);
    } else {
        console.log('Tried to progress beyond the last game');
    }
};

GameSeries.prototype.changeGame = function(to, doFade) {
    if (doFade === undefined) {
        doFade = true;
    }
    if (doFade) {
        this.nextGame = to;
        this.fadeDelta = -0.5;
    } else {
        this.nextGame = null;
        this.currentGame = to;
        this.fade = 1.0;
        this.fadeDelta = 0.0;
    }
};

GameSeries.prototype.draw = function(canvas, ctx) {
    this.currentGame.draw(canvas, ctx);
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1.0 - this.fade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
};

GameSeries.prototype.update = function(timeDelta) {
    if (this.currentGame !== null) {
        this.currentGame.update(timeDelta);
        if (this.currentGame.isFinished()) {
            this.toNextGame();
        }
    }
    this.fade += this.fadeDelta * timeDelta * 0.001;
    if (this.fade < 0) {
        this.fade = 0;
        if (this.nextGame !== null) {
            this.currentGame = this.nextGame;
            this.fadeDelta = 0.5;
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
    gameCanvas = document.createElement('canvas');
    gameCanvas.id = 'game';
    gameCanvas.width = 640;
    gameCanvas.height = 480;
    gameCtx = gameCanvas.getContext('2d');
    document.body.appendChild(gameCanvas);
    startTime = Date.now(); 
    lastFrameTime = Date.now();

    gameSeries = new GameSeries();
    gameSeries.loadAll();

    requestAnimationFrame(doFrame);
}