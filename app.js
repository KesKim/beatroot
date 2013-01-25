var canvas;
var ctx;

function init() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    ctx.fillRect(0, 0, 10, 10);
}