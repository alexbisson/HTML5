//Charles-Étienne Pagé
function SudokuSolver () {
	this.GRID_LIMIT = 3;
	this.ROWS_LIMIT = 9;
	this.COLUMNS_LIMIT = 9;
	this.MAX_VALUE = 9;
	this.MIN_VALUE = 1;
	this.SENTINEL_VALUE = 0;
	this.M_;
	this.SUDOKU_EASY = [0,1,3,0,0,0,0,0,0,
					   0,0,0,1,8,4,0,3,0,
					   8,0,6,3,0,0,0,2,0,
					   3,0,0,0,1,0,0,0,7,
					   1,0,0,5,9,0,4,8,0,
					   0,8,7,0,3,0,1,0,0,
					   0,7,0,0,0,0,0,5,9,
					   0,2,5,0,0,0,0,0,0,
					   0,0,0,0,0,9,0,1,0];
	this.SUDOKU_NORMAL = [5,1,0,0,0,2,0,0,9,
						 0,0,0,0,0,9,8,0,0,
						 0,6,7,0,0,3,1,0,0,
						 0,2,0,0,0,0,0,3,0,
						 7,0,1,0,0,6,0,4,0,
						 0,5,6,9,0,0,0,0,8,
						 8,0,0,4,6,1,2,0,0,
						 0,9,4,0,0,0,0,0,1,
						 0,0,0,0,0,0,4,7,0];
	this.SUDOKU_HARD =  [2,3,9,0,0,0,0,0,0,
						0,0,0,0,0,0,0,5,0,
						4,0,0,0,7,9,0,1,3,
						0,0,2,0,0,8,0,0,9,
						0,9,7,4,0,0,0,0,0,
						0,0,0,0,0,1,0,2,0,
						0,8,5,0,6,0,0,0,0,
						3,2,0,0,4,0,6,0,0,
						0,0,0,0,0,0,5,0,8];
	this.SUDOKU_VERY_HARD = [3,0,0,0,6,0,8,7,0,
							8,0,0,0,0,2,0,0,0,
							0,1,0,7,0,0,5,0,0,
							0,0,0,8,0,0,0,0,6,
							0,5,0,4,0,6,0,3,0,
							6,0,0,0,0,5,0,0,0,
							0,0,2,0,0,7,0,4,0,
							0,0,0,1,0,0,0,0,9,
							0,3,4,0,5,0,0,0,2];
							
	this.GRIDS = [this.SUDOKU_EASY, this.SUDOKU_NORMAL, this.SUDOKU_HARD, this.SUDOKU_VERY_HARD];
	this.SUDOKU_GRID = [];
	this.A_ = [];
	this.totalOperations = 0;
	this.gridDifficulty = 0;
}

SudokuSolver.prototype.findSolution = function() {
	M_ = [];
	this.A_ = [];
	this.gridDifficulty = Math.floor((Math.random()*4));
	this.SUDOKU_GRID = this.GRIDS[this.gridDifficulty];
	this.totalOperations = 0;
	for (var i=0; i < this.ROWS_LIMIT ;i++) {
		M_[i] = this.M2();
	}
	
	var z = 0;
	for (var i=0; i < this.ROWS_LIMIT ;i++) {
		for (var j=0; j < this.COLUMNS_LIMIT ;j++) {
			M_[i][j].number = this.SUDOKU_GRID[z];
			M_[i][j].usable = (this.SUDOKU_GRID[z] == 0) ? true : false;
			z++;
		}
	}
	this.placeNumber(0,0);
}
SudokuSolver.prototype.M2 = function() {
	var M2_ = [];
	for (var i=0; i < this.COLUMNS_LIMIT ;i++) {
		M2_[i] = {number:0 , usable: true};
	}
	return M2_;
};
SudokuSolver.prototype.placeNumber = function(x, y) {
	if(!this.matrixFull()) {
		this.totalOperations++;
		if(y >= this.MAX_VALUE) {
			y = 0;
			++x;
		}
		if(M_[x][y].number == this.SENTINEL_VALUE) {
			this.A_.push({x: x,y: y,value: -1});
			for(var z = 1; z <= this.MAX_VALUE ; ++z) {
				if(this.isUsable(x, y, z)) {
					this.A_.push({x: x,y: y,value: z});
					M_[x][y].number = z;
					this.placeNumber(x, y+1);
				}
				this.A_.push({x: x,y: y,value: this.SENTINEL_VALUE});
				M_[x][y].number = this.SENTINEL_VALUE;
			}
		}	
		else {
			this.placeNumber(x, y+1);
		}		
	}
	else {
		this.A_.push({x: -1,y: -1,value: -1});
	}
}
SudokuSolver.prototype.matrixFull = function() {
	for(var i = 0; i < this.ROWS_LIMIT ;++i) {
		for(var j = 0; j < this.COLUMNS_LIMIT ;++j) {
			if(M_[i][j].number == this.SENTINEL_VALUE)
				return false;
		}
	}
	return true;
}
SudokuSolver.prototype.isUsable = function(x, y, z) {
	var usable = false;
	if((z <= this.MAX_VALUE) && (z >= this.MIN_VALUE) && (M_[x][y].usable == true))
		usable = true;
	if(!this.lookRows(x, y, z))
		return false;
	if(!this.lookColumns(x, y, z))
		return false;
	if(!this.lookGrid(x, y, z))
		return false;
	return usable;
}
SudokuSolver.prototype.lookRows = function(x, y, z) {
	for(var i = 0; i < this.ROWS_LIMIT ;++i) {
		if(M_[x][i].number == z)
			return false;
	}
	return true;
}
SudokuSolver.prototype.lookColumns = function(x, y, z) {
	for(var i = 0;i < this.COLUMNS_LIMIT;++i) {
		if(M_[i][y].number == z)
			return false;
	}
	return true;
}
SudokuSolver.prototype.lookGrid = function(x, y, z) {
	var grid = Math.floor( x / this.GRID_LIMIT ) * this.GRID_LIMIT + Math.floor( y / this.GRID_LIMIT );
	var row = Math.floor( this.GRID_LIMIT * Math.floor( grid / this.GRID_LIMIT ));
	var column = Math.floor( this.GRID_LIMIT * Math.floor( grid % this.GRID_LIMIT ));
	
	for(var i = 0; i < this.GRID_LIMIT ;++i) {
		for(var j = 0; j < this.GRID_LIMIT ;++j) {
			if(M_[row+i][column+j].number == z)
				return false;
		}
	}
	return true;
}
SudokuSolver.prototype.getGridToSolve = function() {
	return gridToSolve_;
}
SudokuSolver.prototype.getGridSolved = function() {
	return gridSolved_;
}



