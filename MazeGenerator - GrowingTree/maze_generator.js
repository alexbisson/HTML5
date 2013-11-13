//Charles-Étienne Pagé
function MazeGenerator(width, height) {
	this.Grid;
	this.Replay;
	this.Cells;
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
	Cells = [];
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
	Cells.push({x: rWidth, y: rHeight, number: 0});
	this.emptyCells();
}
MazeGenerator.prototype.emptyCells = function() {
	var index = 0;
	while(Cells.length > 0) {
		index = this.nextIndex(Cells.length);
		var x = Cells[index].x;
		var y = Cells[index].y;
		
		var directions = this.shuffle([this.DIRECTION.N, this.DIRECTION.S, this.DIRECTION.E, this.DIRECTION.W]);
		var nextX;
		var nextY;
		for(var i = 0; i < directions.length; i++) {
			nextX = x + this.DIRECTIONX[directions[i]];
			nextY = y + this.DIRECTIONY[directions[i]];
			if(!this.isOutOfBounds(nextX, nextY) && Grid[nextX][nextY] == 0) {
				Grid[x][y] |= directions[i];
				Grid[nextX][nextY] |= this.OPPOSITE[directions[i]];
				
				Replay.push({x: x, y: y, pass: 1, number: Grid[x][y]});
				Cells.push({x: nextX, y: nextY, number: Grid[nextX][nextY]});
				index = -1;
				break;
			}
		}
		if(index != -1) {
			Cells.splice(index, 1);
		}
		else {
			Replay.push({x: nextX, y: nextY, pass: 2, number: Grid[nextX][nextY]});
		}
	}
}
MazeGenerator.prototype.nextIndex = function (maximum) {
	var algorithm = (Math.random() * 3) | 0;
	return (algorithm == 0) ? 0 : (algorithm == 1) ? maximum - 1 : (Math.random() * maximum) | 0;
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