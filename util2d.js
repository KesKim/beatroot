var Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
};

Vec2.prototype.normalize = function() {
    var len = this.length();
    this.x /= len;
    this.y /= len;
};

Vec2.prototype.distance = function(vec) {
    return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
};

Vec2.prototype.length = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

function getRelativeCoords(event, element) {
    var rect = element.getBoundingClientRect();
    // + 0.5 to move to pixel center
    if (event.touches !== undefined && event.touches.length > 0) {
        return new Vec2(event.touches[0].clientX - rect.left + 0.5, event.touches[0].clientY - rect.top + 0.5);
    }
    return new Vec2(event.clientX - rect.left + 0.5, event.clientY - rect.top + 0.5);
}