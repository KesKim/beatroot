var Audio = function(filenames) {
    this.loaded = false;
    this.playWhenLoaded = false;
    this.filenames = filenames;
    this.audio = document.createElement('audio');
    this.audio.loop = false;
    for (var i = 0; i < this.filenames.length; ++i) {
        var source = document.createElement('source');
        source.src = 'Assets/' + this.filenames[i];
        this.audio.appendChild(source);
    }
}

Audio.prototype.play = function () {
    this.audio.play();
}