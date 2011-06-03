// Constants
const LEFT_ARROW = 37;		// move left
const RIGHT_ARROW = 39;		// move right
const SPACE_BAR = 32;		// fire

const SKY_COLOR = "#1F1F1F";
const GROUND_COLOR = "#1A3300";

const CANNON_MOV = 5;
const ALIENS_XMOV = 3;
const ALIENS_YMOV = 10;

const VELOCITY = -0.5;
const REDRAW_INTERVAL = 25;

// Global variables
var leftArrowDown = false;
var rightArrowDown = false;
var spaceBarDown = false;

var hFlag = "GO_RIGHT";
var vFlag = "STAY";

// Cannon object & prototype
function Cannon(x, y, lives, filename) {
	this.x = x;
	this.y = y;
	this.lives = lives;
	this.init(filename);
	this.width = 19;
	this.height = 22;
}
Cannon.prototype = {
	imgLoaded: false,

	init: function(filename) {
		var self = this;
		this.img = new Image();
		this.img.onload = function() {
			self.imgLoaded = true;
		}
		this.img.src = filename;
	},

	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.width;
	},
	  
	getTop: function() {
		return this.y - this.height;
	},
	
	getBottom: function() {
		return this.y;
	},
	
	getLives: function() {
		return this.lives;
	},
	  
	draw: function(ctx) {
		if (this.imgLoaded) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	},
	
	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},

	move: function(dx, dy) {
		this.x += dx;
		this.y += dy;
	},
	
	fire: function() {
		// creates new lasers - one at a time
		if(TheWorld.lasers.length < 1) {
			TheWorld.addLaserObject(new Laser(this.getLeft()+this.width/2, this.getBottom()));
		}
	},
	
	destroyed: function() {
		if (this.getLives() > 0) {
			this.lives -= 1;
		}
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	}
};

// Laser object & prototype
function Laser(x, y) {
  this.width = 1;
  this.height = 10;

  this.x = x;
  this.y = y;

  this.vx = 0;
  this.vy = 0;

  this.color = "#FF0000";
}
Laser.prototype = {
	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.width;
	},
	  
	getTop: function() {
		return this.y - this.height;
	},
	
	getBottom: function() {
		return this.y;
	},
	
	update: function(elapsedMs) {
		this.x += this.vx * elapsedMs / REDRAW_INTERVAL;
		this.y += this.vy * elapsedMs / REDRAW_INTERVAL;
		
		this.vy += VELOCITY * elapsedMs / REDRAW_INTERVAL;
	},

	draw: function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
	}
};

// Alien object & prototype
function Alien(x, y, rank, destroyed, filename) {
	this.x = x;
	this.y = y;
	this.rank = rank;
	this.destroyed = destroyed;
	this.init(filename);
	this.width = 22;
	this.height = 16;
	this.animationFrame = 0;
}
Alien.prototype = {
	imgLoaded: false,

	init: function(filename) {
		var self = this;
		this.img = new Image();
		this.img.onload = function() {
			self.imgLoaded = true;
		}
		this.img.src = filename;
	},

	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.width;
	},
	  
	getTop: function() {
		return this.y - this.height;
	},
	
	getBottom: function() {
		return this.y;
	},
	
	getRank: function() {
		return this.rank;
	},
	
	getDestroyed: function() {
		return this.destroyed;
	},

	draw: function(ctx) {
		if (this.imgLoaded) {
			if (this.destroyed == 0) {
				var spriteOffsetX = 22 * this.animationFrame;
				// ctx.drawImage(this.img, spriteOffsetX, 0, 22, 16, this.x, this.y, 22, 16);
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			}
		}
	},

	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},

	move: function(dx, dy) {
		// this.animationFrame = (this.animationFrame + 1) % 2;
		this.x += dx;
		this.y += dy;
	},
	
	fire: function() {
	
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	}
};

// Barrier object & prototype
// TO DO

// The World
var TheWorld = {
	canvasWidth: 550,
	canvasHeight: 450,
	groundLevel: 425,

	gameIsOver: false,
	
	totalMs: 0,
	
	player: null,		// player's cannon object
	lasers: [],			// list of cannon's lasers on canvas
	aliens: [],			// list of aliens on canvas
	barriers: [],		// list of barriers on canvas

	addPlayerObject: function(obj) {
		this.player = obj;
	},
	
	addLaserObject: function(obj) {
		this.lasers.push(obj);
	},
	
	addAlienObject: function(obj) {
		this.aliens.push(obj);
	},

	addBarrierObject: function(obj) {
		this.barriers.push(obj);
	},
	
	drawObject: function(obj, ctx) {
		obj.draw(ctx);
	},

	updateAll: function(elapsed) {
		var i, laser, alien;
		
		// keep track of total survival time
		this.totalMs += elapsed;

		// update lasers
		for (i=0; i<this.lasers.length; i++) {
			laser = this.lasers[i];
			laser.update(elapsed);
		}

		// check for collisions - end the game if you touch something
		for (i=0; i<this.aliens.length; i++) {
			alien = this.aliens[i];
			if (this.player.isTouching(alien)) {
				this.endGame();
			}
		}

		// remove lasers that have gone off top of canvas
		var stillOnScreen = [];
		for (i=0; i<this.lasers.length; i++) {
			laser = this.lasers[i];
			if (laser.getBottom() > 0) {
				stillOnScreen.push(laser);
			}
		}
		this.lasers = stillOnScreen;
	},
	
	drawAll: function(ctx) {
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		// Ground
		ctx.fillStyle = GROUND_COLOR;
		ctx.fillRect(0, this.groundLevel, this.canvasWidth, this.canvasHeight);
		
		// Horizon
		ctx.strokeStyle = "black";
		ctx.strokeWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, this.groundLevel);
		ctx.lineTo(this.canvasWidth, this.groundLevel);
		ctx.stroke();
		
		// Sky
		ctx.fillStyle = SKY_COLOR;
		ctx.fillRect(0, 0, this.canvasWidth, this.groundLevel);
		
		// Draw all objects
		var i;
		// player's cannon
		this.drawObject(this.player, ctx);
		// cannon's lasers
		for (i=0; i<this.lasers.length; i++) {
			this.drawObject(this.lasers[i], ctx);
		}
		// all alien objects
		for (i=0; i<this.aliens.length; i++) {
			this.drawObject(this.aliens[i], ctx);
		}
		// all barrier objects
		for (i=0; i<this.barriers.length; i++) {
			this.drawObject(this.barriers[i], ctx);
		}
	},
	
	endGame: function() {
		this.gameIsOver = true;
		// Show final message:
		$("#info").html("GAME OVER - Reload to play again.");
	}
};

// Main event whose function controls the game
$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
	var now = Date.now();
	var cannon = new Cannon(100, TheWorld.groundLevel-22, 3, "images/cannon.png");

	// Put the player in the world:
	TheWorld.addPlayerObject(cannon);
	
	var i, j, filename;
	// Create some invaders objects:
	for(i=0; i<5; i++) {
		switch(i){
			case 0:
				filename = "images/alien3.png";
			break;
			case 1:
				filename = "images/alien2.png";
			break;
			case 2:
				filename = "images/alien2.png";
			break;
			case 3:
				filename = "images/alien1.png";
			break;
			case 4:
				filename = "images/alien1.png";
			break;
		}
		for(j=0; j<11; j++) {
			TheWorld.addAlienObject(new Alien(100 + j*33, 50 + i*33, 3, 0, filename));
		}
	}
	
	//TheWorld.aliens[1].destroyed = 1;
	//TheWorld.drawAll(context);

	var worldInterval = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var elapsed = Date.now() - now;
			now = Date.now();
			TheWorld.updateAll(elapsed);
			TheWorld.drawAll(context);
		}
	}, REDRAW_INTERVAL);

	// Interval that controls the aliens' movement across the canvas
	var aliensMov = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var i;
			
			// Check the direction of the movement of the aliens based on the sides of the canvas
			for(i=0; i<TheWorld.aliens.length; i++) {
				if(TheWorld.aliens[i].getRight() <= TheWorld.canvasWidth && 
				   TheWorld.aliens[i].getRight() >= TheWorld.canvasWidth - 5) {
					hFlag = "GO_LEFT";
					vFlag = "GO_DOWN";
					break;
				}
				else if(TheWorld.aliens[i].getLeft() >= 0 && 
						TheWorld.aliens[i].getLeft() <= 5) {
					hFlag = "GO_RIGHT";
					vFlag = "GO_DOWN";
					break;
				}
			}
			
			// Move the aliens down once they reached either far left or far right side of the canvas
			if(vFlag == "GO_DOWN") {
				for(i=0; i<TheWorld.aliens.length; i++) {
					if(TheWorld.aliens[i].getDestroyed() == 0) {
						TheWorld.aliens[i].move(0, ALIENS_YMOV);
					}
				}
				vFlag = "STAY";
			}
			
			//Move the aliens either to the left or right side of the canvas
			if(hFlag == "GO_RIGHT") {
				for(i=0; i<TheWorld.aliens.length; i++) {
					if(TheWorld.aliens[i].getDestroyed() == 0) {
						TheWorld.aliens[i].move(ALIENS_XMOV, 0);
					}
				}
			}
			else if(hFlag == "GO_LEFT") {
				for(i=0; i<TheWorld.aliens.length; i++) {
					if(TheWorld.aliens[i].getDestroyed() == 0) {
						TheWorld.aliens[i].move(-ALIENS_XMOV, 0);
					}
				}
			}
		}
	}, 50);

	// Keydown event
	$(document).bind("keydown", function(evt) {
		if (evt.which == LEFT_ARROW) {
			leftArrowDown = true;
		}
		if (evt.which == RIGHT_ARROW) {
			rightArrowDown = true;
		}
		if (evt.which == SPACE_BAR) {
			spaceBarDown = true;
		}
	});

	// Keyup event
	$(document).bind("keyup", function(evt) {
		if (evt.which == LEFT_ARROW) {
			leftArrowDown = false;
		}
		if (evt.which == RIGHT_ARROW) {
			rightArrowDown = false;
		}
		if (evt.which == SPACE_BAR) {
			spaceBarDown = false;
		}
	});

	// Interval event of the window which controls the players laser cannon movement through the left and right arrow keys
	window.setInterval(function() {
		TheWorld.drawAll(context);
		if (leftArrowDown && !rightArrowDown) {;
			(cannon.getLeft() >= CANNON_MOV) ? cannon.move(-CANNON_MOV, 0) : 0;
		}
		if (rightArrowDown && !leftArrowDown) {
			(cannon.getRight() <= TheWorld.canvasWidth-CANNON_MOV) ? cannon.move(CANNON_MOV, 0) : 0;
		}
		if (spaceBarDown) {
			cannon.fire();
		}
	}, 1);
});