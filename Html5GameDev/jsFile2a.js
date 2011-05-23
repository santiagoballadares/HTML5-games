// @Description: Draws an image in a canvas object and moves it around the screen with the arrow keys
// @Autor: Santiago Balladares
// @Date: 14/05/2011 14:00

$(document).ready(function() {
	// Global Variables
	var watchKeys = [37,38,39,40];
	var up, down, left, right;

	var ctx = $("#game_canvas")[0].getContext("2d");
	var canvasWidth = 800;
	var canvasHeight = 450;

	// Tank Object
	function Tank(filename, x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.init(filename);
	}

	// Tank Prototype
	Tank.prototype = {
		imgLoaded: false,

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

		move: function(dx, dy) {
			this.x += dx;
			this.y += dy;
		}
	};

	// Background Drawing Function
	function drawBackground() {
		// Initialize Context
		ctx.strokeStyle = "black";
		ctx.strokeWidth = 1;

		// sky
		ctx.fillStyle = "#99CCFF";
		ctx.fillRect(0, 0, canvasWidth, 300);

		// ground
		ctx.fillStyle = "#FFCC66";
		ctx.fillRect(0, 300, canvasWidth, 150);

		// mountains
		ctx.beginPath();
		ctx.moveTo(500, 300);
		ctx.lineTo(570, 200);
		ctx.lineTo(660, 300);
		ctx.lineTo(730, 150);
		ctx.lineTo(800, 300);
		ctx.fill();
		ctx.stroke();

		// pyramid
		ctx.fillStyle = "#CC9933";
		ctx.beginPath();
		ctx.moveTo(50, 300);
		ctx.lineTo(150, 180);
		ctx.lineTo(185, 307);
		ctx.lineTo(50, 300);
		ctx.moveTo(150, 180);
		ctx.lineTo(250, 300);
		ctx.lineTo(185, 307);
		ctx.fill();
		ctx.stroke();

		// hut
		ctx.fillStyle = "#996633";
		ctx.beginPath();
		ctx.moveTo(400, 320);
		ctx.lineTo(400, 240);
		ctx.lineTo(550, 240);
		ctx.lineTo(550, 320);
		ctx.fill();
		ctx.stroke();

		// hut door
		ctx.fillStyle = "#663300";
		ctx.beginPath();
		ctx.moveTo(430, 320);
		ctx.lineTo(430, 280);
		ctx.lineTo(460, 280);
		ctx.lineTo(460, 320);
		ctx.fill();
		ctx.stroke();

		// hut window
		ctx.fillStyle = "#663300";
		ctx.beginPath();
		ctx.moveTo(500, 295);
		ctx.lineTo(500, 270);
		ctx.lineTo(530, 270);
		ctx.lineTo(530, 295);
		ctx.lineTo(500, 295);
		ctx.fill();
		ctx.stroke();

		// horizon
		ctx.beginPath();
		ctx.moveTo(0, 300);
		ctx.lineTo(50, 300);
		ctx.moveTo(250, 300);
		ctx.lineTo(400, 300);
		ctx.moveTo(550, 300);
		ctx.lineTo(canvasWidth, 300);
		ctx.stroke();
		
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

	// Initialize
	var tank = new Tank("images/tank.gif", 10, 260, 104, 65);
	drawBackground();

	// Clears, draws the background, and move the tank
	function drawTank(dx, dy) {
		tank.erase();
		drawBackground();
		tank.move(dx, dy);
		tank.draw();
	}

	// Keydown sets Timer
	$(document).keydown(function(e) {
		var evt = e || window.event;
		var code = evt.keyCode? evt.keyCode : evt.charCode;
		var keyIndex = jQuery.inArray(code, watchKeys);

		if (keyIndex > -1 && keyIndex < 4){
			switch(keyIndex) {
				case 0: // Left Arrow
					clearInterval(left);
					left = setInterval(function() {
						(tank.x > 0) ? drawTank(-5, 0) : 0;
					}, 10);
				break;

				case 1: // Up Arrow
					clearInterval(up);
					up = setInterval(function() {
						(tank.y > 260) ? drawTank(0, -5) : 0;
					}, 10);
				break;

				case 2: //Right Arrow
					clearInterval(right);
					right = setInterval(function() {
						(tank.x < canvasWidth - tank.width) ? drawTank(5, 0) : 0;
					}, 10);
				break;

				case 3: //Down Arrow
					clearInterval(down);
					down = setInterval(function() {
						(tank.y < canvasHeight - tank.height) ? drawTank(0, 5) : 0;
					}, 10);
				break;
			}
		}
	});

	// Keyup clears Timer
	$(document).keyup(function(e) {
		var evt = e || window.event;
		var code = evt.keyCode? evt.keyCode : evt.charCode;
		var keyIndex = jQuery.inArray(code, watchKeys);

		if (keyIndex > -1 && keyIndex < 4) {
			switch(keyIndex) {
				case 0: //Left Arrow
					clearInterval(left);
				break;

				case 1: //Up Arrow
					clearInterval(up);
				break;

				case 2: //Right Arrow
					clearInterval(right);
				break;

				case 3: //Down Arrow
					clearInterval(down);
				break;
			}
		}
	});
});