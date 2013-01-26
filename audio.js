var Audio = function(filenameA, filenameB) {
	this.loaded = false;

	this.filenameA = filenameA;
	this.filenameB = filenameB;
	this.audio = document.createElement('audio');
	console.log(this.audio);
	
	var sourceA = document.createElement('source');
	sourceA.src = 'Assets/' + filenameA;
	sourceA.loop = true;

	var sourceB = document.createElement('source');
	sourceB.src = 'Assets/' + filenameB;

	var that = this;
	this.img.onload = function() {
		that.loaded = true;
	}
}