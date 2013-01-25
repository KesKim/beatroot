var canvas;
var ctx;

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var start = Date.now(); 

function doFrame() {
    var timestamp = Date.now(); 
    var progress = timestamp - start;
    ctx.fillStyle = 'rgb(' + Math.round(Math.sin(progress * 0.001) * 128 + 128) + ',0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(doFrame);
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
    requestAnimationFrame(doFrame);
}