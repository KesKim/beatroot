var DialogLine = function(string, clearScreenColor) {
	this.text = string;
	this.blankScreenBeforeText = true;

	// Use if defined.
	this.blankScreenColor = clearScreenColor ? 'black' : clearScreenColor;
}