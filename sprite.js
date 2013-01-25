var Sprite = function(filename) {
    this.filename = filename;
    this.img = document.createElement('img');
    this.img.src = 'Assets/' + filename;
    this.loaded = false;
    var that = this;
    this.img.onload = function() {
        that.loaded = true;
    };
};

Sprite.prototype.draw = function(ctx, x, y) {
    if (this.loaded) {
        ctx.drawImage(this.img, x, y);
    }
};