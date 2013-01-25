var canvas;
var ctx;

var time = {
    current: 0,
    lastFrame: 0,
    start: 0
};

var game = {
    funk: 0
};

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function doFrame() {
    time.current = Date.now(); 
    var timeDelta = time.current - time.lastFrame;
    if (timeDelta > 10) { // don't bother with drawing frames that are too close to each other
        time.lastFrame = time.current;
        updateGame(timeDelta);
        drawFrame();
    }
    requestAnimationFrame(doFrame);
}

function updateGame(timeDelta) {
    game.funk = Math.sin(time.current * 0.002) * 0.5 + 0.5;
}

function drawFrame() {
    ctx.fillStyle = 'rgb(' + Math.round(game.funk * 255) + ', 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'game';
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    ctx.fillStyle = '#f9c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    startTime = Date.now(); 
    lastFrameTime = Date.now();
    requestAnimationFrame(doFrame);
}