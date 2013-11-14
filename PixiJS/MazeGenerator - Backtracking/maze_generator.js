//Charles-Étienne Pagé
function MazeGenerator(width, height) {
	this.Grid;
	this.Replay;
	this.DIRECTION = {N:1,S:2,E:4,W:8};
	this.DIRECTIONX = [];
	this.DIRECTIONY = [];
	this.OPPOSITE = [];
	this.WIDTH = width;
	this.HEIGHT = height;
}
MazeGenerator.prototype.init = function() {

	this.OPPOSITE[this.DIRECTION.N] = this.DIRECTION.S;
	this.OPPOSITE[this.DIRECTION.S] = this.DIRECTION.N;
	this.OPPOSITE[this.DIRECTION.E] = this.DIRECTION.W;
	this.OPPOSITE[this.DIRECTION.W] = this.DIRECTION.E;
	
	this.DIRECTIONX[this.DIRECTION.N] = 0;
	this.DIRECTIONX[this.DIRECTION.S] = 0;
	this.DIRECTIONX[this.DIRECTION.E] = 1;
	this.DIRECTIONX[this.DIRECTION.W] = -1;
	
	this.DIRECTIONY[this.DIRECTION.N] = -1;
	this.DIRECTIONY[this.DIRECTION.S] = 1;
	this.DIRECTIONY[this.DIRECTION.E] = 0;
	this.DIRECTIONY[this.DIRECTION.W] = 0;
	Replay = [];
	Grid = [];
	for(var i = 0;i < this.WIDTH; i++) {
		var column = [];
		for(var j = 0;j < this.HEIGHT; j++) {
			column[j] = 0;
		}
		Grid[i] = column;
	}
}
MazeGenerator.prototype.generate = function() {
	var rWidth = (Math.random() * this.WIDTH) | 0;
	var rHeight = (Math.random() * this.HEIGHT) | 0;
	this.carvePassage(rWidth, rHeight);
	Replay.push({x: rWidth, y: rHeight, pass: 2});
}
MazeGenerator.prototype.carvePassage = function(x,y) {
	var directions = this.shuffle([this.DIRECTION.N, this.DIRECTION.S, this.DIRECTION.E, this.DIRECTION.W]);
	
	for(var i = 0; i < directions.length; i++) {
		var nextX = x + this.DIRECTIONX[directions[i]];
		var nextY = y + this.DIRECTIONY[directions[i]];
		if(!this.isOutOfBounds(nextX, nextY) && Grid[nextX][nextY] == 0) {
			Grid[x][y] |= directions[i];
			Grid[nextX][nextY] |= this.OPPOSITE[directions[i]];
			Replay.push({x: x, y: y, pass: 1, number: Grid[x][y]});
			this.carvePassage(nextX, nextY);
			Replay.push({x: nextX, y: nextY, pass: 2, number: Grid[nextX][nextY]});
		}
	}
}
MazeGenerator.prototype.shuffle = function (array) {
	//Fisher-Yates shuffle
	var counter = array.length, temp, index;
	while(counter--) {
		index = (Math.random() * counter) | 0;
		
		temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
	}
	return array;
}
MazeGenerator.prototype.isOutOfBounds = function (x, y) {
	if(x < 0 || x >= this.WIDTH) {
		return true;
	}
	if(y < 0 || y >= this.HEIGHT) {
		return true;
	}
	return false;
}
MazeGenerator.prototype.getReplay = function() {
	return Replay;
}