// @Description: Draws a chess board with images of the pieces
// @Autor: Santiago Balladares
// @Date: 15/05/2011 10:00

$(document).ready(function() {
	// Global Variables
	var ctx = $("#game_canvas")[0].getContext("2d");
	var canvasWidth = 530;
	var canvasHeight = 530;

	// Game Piece Object
	function Piece(filename, x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.color = c;
		this.init(filename);
	}

	// Game Piece Prototype
	Piece.prototype = {
		imgLoaded: false,
		selected: false,

		init: function(filename) {
			var self = this;
			this.img = new Image();
			this.img.onload = function() {
				self.imgLoaded = true;
				self.draw();
			};
			this.img.src = filename;
		},

		draw: function() {
			if (this.imgLoaded) {
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			}
		},

		erase: function() {
			ctx.clearRect(this.x, this.y, this.width, this.height);
		},

		move: function(x, y) {
			this.x = x;
			this.y = y;
		}
	};

	// Game Board Drawing Function
	function drawBoard() {
	// variables to alternate the fill style
	var flag_row = 0;
	var flag_col = 0;

	ctx.strokeStyle = "#B8B8B8";

	// chess board
	for (var i=9; i<520; i+=64) {
		for (var j=9; j<520; j+=64) {
			// chooses if logic based on the flag_row value
			if (flag_row == 0) {
				// altenarte fill style color based on the flag_col value
				// and changes it's value for next column chess box
				if (flag_col == 0) {
					ctx.fillStyle = "#B8B8B8";
					flag_col = 1;
				}
				else {
					ctx.fillStyle = "#707070";
					flag_col = 0;
				}
			}
			else {
				// altenarte fill style color based on the flag_col value
				// and changes it's value for next column chess box
				if (flag_col == 1) {
					ctx.fillStyle = "#B8B8B8";
					flag_col = 0;
				}
				else {
					ctx.fillStyle = "#707070";
					flag_col = 1;
				}
			}
			ctx.beginPath();
			ctx.moveTo(i, j);
			ctx.lineTo(i+64, j);
			ctx.lineTo(i+64, j+64);
			ctx.lineTo(i, j+64);
			ctx.lineTo(i, j);
			ctx.fill();
			ctx.stroke();
		}
		// changes flag_row value for next row
		(flag_row==0) ? flag_row=1 : flag_row=0;
	}

	// border filling
	ctx.fillStyle = "#484848";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(10, 0);
	ctx.lineTo(10, canvasHeight);
	ctx.lineTo(0, canvasHeight);
	ctx.moveTo(0, canvasHeight-10);
	ctx.lineTo(canvasWidth, canvasHeight-10);
	ctx.lineTo(canvasWidth, canvasHeight);
	ctx.lineTo(0, canvasHeight);
	ctx.moveTo(canvasWidth, canvasHeight);
	ctx.lineTo(canvasWidth-10, canvasHeight);
	ctx.lineTo(canvasWidth-10, 0);
	ctx.lineTo(canvasWidth, 0);
	ctx.moveTo(canvasWidth, 0);
	ctx.lineTo(canvasWidth, 10);
	ctx.lineTo(0, 10);
	ctx.lineTo(0, 0);
	ctx.fill();

	// border line
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvasWidth, 0);
	ctx.lineTo(canvasWidth, canvasHeight);
	ctx.lineTo(0, canvasHeight);
	ctx.lineTo(0, 0);
	ctx.stroke();
	}

	// Draw Game Board and Initialize Pieces
	drawBoard();
	var piece;
	var playersPieces = [];

	for (var i=0; i<8; i++) {
		piece = new Piece("images/w_pawn.png", i*64+28, 415, 19, 34, "white");
		playersPieces.push(piece);
		piece = new Piece("images/b_pawn.png", i*64+28, 95, 19, 34, "black");
		playersPieces.push(piece);
	}

	piece = new Piece("images/w_rook.png", 25, 485, 23, 27, "white");
	playersPieces.push(piece);
	piece = new Piece("images/w_rook.png", 473, 485, 23, 27, "white");
	playersPieces.push(piece);
	piece = new Piece("images/b_rook.png", 25, 38, 23, 27, "black");
	playersPieces.push(piece);
	piece = new Piece("images/b_rook.png", 473, 38, 23, 27, "black");
	playersPieces.push(piece);

	piece = new Piece("images/w_knight.png", 89, 475, 29, 37, "white");
	playersPieces.push(piece);
	piece = new Piece("images/w_knight.png", 409, 475, 29, 37, "white");
	playersPieces.push(piece);
	piece = new Piece("images/b_knight.png", 89, 28, 29, 37, "black");
	playersPieces.push(piece);
	piece = new Piece("images/b_knight.png", 409, 28, 29, 37, "black");
	playersPieces.push(piece);

	piece = new Piece("images/w_bishop.png", 153, 468, 20, 45, "white");
	playersPieces.push(piece);
	piece = new Piece("images/w_bishop.png", 345, 468, 20, 45, "white");
	playersPieces.push(piece);
	piece = new Piece("images/b_bishop.png", 153, 20, 20, 45, "black");
	playersPieces.push(piece);
	piece = new Piece("images/b_bishop.png", 345, 20, 20, 45, "black");
	playersPieces.push(piece);

	piece = new Piece("images/w_queen.png", 217, 463, 20, 51, "white");
	playersPieces.push(piece);
	piece = new Piece("images/b_queen.png", 217, 15, 20, 51, "black");
	playersPieces.push(piece);

	piece = new Piece("images/w_king.png", 281, 461, 20, 54, "white");
	playersPieces.push(piece);
	piece = new Piece("images/b_king.png", 281, 14, 20, 54, "black");
	playersPieces.push(piece);

	// Mousedown event
	$("canvas").mousedown(function(e) {
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		for (var i=0; i<playersPieces.length; i++) {
			if (x > playersPieces[i].x - playersPieces[i].width && x < playersPieces[i].x + playersPieces[i].width &&
			y > playersPieces[i].y - playersPieces[i].height && y < playersPieces[i].y + playersPieces[i].height) {
				playersPieces[i].selected = true;
				console.log(playersPieces[i].selected);
				return;
			}
		}
	});

	// Mousemove event
	$("canvas").mousemove(function(e) {
		for (var i=0; i<playersPieces.length; i++) {
			if (playersPieces[i].selected) {
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY- this.offsetTop;
				playersPieces[i].erase();
				drawBoard();
				for (j=0; j<playersPieces.length; j++) {
					playersPieces[j].draw();
				}
				playersPieces[i].move(x, y);
				playersPieces[i].draw();
			}
		}
	});

	// Mouseup event
	$("canvas").mouseup(function(e) {
		for (var i=0; i<playersPieces.length; i++) {
			if (playersPieces[i].selected) {
				playersPieces[i].selected = false;
				console.log(playersPieces[i].selected);
				return;
			}
		}
	});
});