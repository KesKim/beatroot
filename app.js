var canvas;
var gameCtx;

var time = {
    current: 0,
    lastFrame: 0,
    start: 0
};

var game = null;

function doFrame() {
    time.current = Date.now(); 
    var timeDelta = time.current - time.lastFrame;
    if (timeDelta > 10) { // don't bother with drawing frames that are too close to each other
        time.lastFrame = time.current;
        game.update(timeDelta);
        game.draw(gameCanvas, gameCtx);
    }
    requestAnimationFrame(doFrame);
}

function updateGame(timeDelta) {
}

function drawFrame() {
}

function loadGameAssets() {
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

    game = new Game();
    game.load();

    requestAnimationFrame(doFrame);
}