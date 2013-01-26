var Audio = function(filenameOgg) {
	this.loaded = false;

	this.filenameA = filenameOgg;
	//this.filenameB = filenameB;
	this.audio = document.createElement('audio');
    this.audio.loop = true;
	console.log(this.audio);
	// TODO add looping.

    if ( filenameOgg )
    {
        var sourceOgg = document.createElement('source');
        sourceOgg.src = 'Assets/' + filenameOgg;
        this.audio.appendChild(sourceOgg);
    }

    /*if ( filenameB )
    {
        var sourceB = document.createElement('source');
        sourceB.src = 'Assets/' + filenameB;
        this.audio.appendChild(sourceB);    
    }*/

	var that = this;

	sourceOgg.onload = function() {
		that.loaded = true;

		if ( playWhenLoaded != null )
		{
			this.play();
		}
	}
}

Audio.prototype.play = function () {
	if ( this.loaded ) {
		this.audio.play();
	}
	else {
		this.playWhenLoaded = true;
	}
}