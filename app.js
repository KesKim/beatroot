var canvas;
var ctx;

function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'game';
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    ctx.fillStyle = '#f9c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}