// @Description: Space Invaders.- Destroy endless waves of aliens while avoiding being destroyed.
// @Autor: Santiago Balladares
// @Date: 01/06/2011 16:16

// Constants
const LEFT_ARROW = 37;		// move left
const RIGHT_ARROW = 39;		// move right
const SPACE_BAR = 32;		// fire

const SKY_COLOR = "#1F1F1F";
const GROUND_COLOR = "#1A3300";

const CANNON_MOV = 1;
const LASER_MOV = 10;
const ALIENS_XMOV = 10;
const ALIENS_YMOV = 10;

const CANNON_REDRAW_INTERVAL = 1;
const ALIENS_REDRAW_INTERVAL = 500;
const THEWORLD_REDRAW_INTERVAL = 25;

const BARRIER01 = "images/barrier1.png";
const BARRIER02 = "images/barrier2.png";
const BARRIER03 = "images/barrier3.png";
const BARRIER04 = "images/barrier4.png";

// Global variables
var leftArrowDown = false;
var rightArrowDown = false;
var spaceBarDown = false;

var hFlag = "GO_RIGHT";
var vFlag = "STAY";
var aliens_xmov_inc = 0.1;

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
		if(TheWorld.cLasers.length < 1) {
			TheWorld.addCLaserObject(new Laser(this.getLeft()+this.width/2, this.getBottom()));
			$(shoot)[0].play();
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

  this.color = "#FFFFFF";
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

	draw: function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
	},
	
	move: function(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
};

// Alien object & prototype
function Alien(x, y, width, heigth, points, filename) {
	this.destroyed = false;
	this.x = x;
	this.y = y;
	this.points = points;
	this.init(filename);
	this.width = width;
	this.height = heigth;
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
	
	getPoints: function() {
		return this.points;
	},

	draw: function(ctx) {
		if (this.imgLoaded && !this.destroyed) {
			var spriteOffsetX;
			switch (this.points) {
				case 10:
					spriteOffsetX = 24 * this.animationFrame;
					ctx.drawImage(this.img, spriteOffsetX, 0, 24, 16, this.x, this.y, 24, 16);
				break;
				case 20:
					spriteOffsetX = 22 * this.animationFrame;
					ctx.drawImage(this.img, spriteOffsetX, 0, 22, 16, this.x, this.y, 22, 16);
				break;
				case 40:
					spriteOffsetX = 16 * this.animationFrame;
					ctx.drawImage(this.img, spriteOffsetX, 0, 16, 16, this.x, this.y, 16, 16);
				break;
			}
			//ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	},

	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},

	move: function(dx, dy) {
		this.animationFrame = (this.animationFrame + 1) % 2;
		this.x += dx;
		this.y += dy;
	},
	
	fire: function() {
	
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	},
	
	destroy: function() {
		this.destroyed = true;
	}
};

// Barrier object & prototype
function Barrier(x, y) {
	this.x = x;
	this.y = y;
	this.width = 15;
	this.height = 15;
	this.health = 400;
	this.destroyed = false;
	this.init(BARRIER01);
}
Barrier.prototype = {
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

	draw: function(ctx) {
		if (this.imgLoaded && !this.destroyed) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	},

	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	},
	
	receiveDamage: function() {
		if (this.health > 0) {
			this.health -= 100;
			switch (this.health) {
				case 300:
					this.img.src = BARRIER02;
				break;
				
				case 200:
					this.img.src = BARRIER03;
				break;
				
				case 100:
					this.img.src = BARRIER04;
				break;
			}
		}
		else if (this.health == 0) {
			this.destroy();
		}
	},
	
	destroy: function() {
		this.destroyed = true;
	}
};

// The World
var TheWorld = {
	canvasWidth: 550,
	canvasHeight: 450,
	groundLevel: 425,

	gameIsOver: false,
	
	score: 0,
	
	totalMs: 0,
	
	level: 1,
	
	player: null,		// player's cannon object
	playerLives: [],	// player's lives
	cLasers: [],		// list of cannon's lasers on canvas
	aLasers: [],		// list of alien's lasers on canvas
	aliens: [],			// list of aliens on canvas
	barriers: [],		// list of barriers on canvas

	addPlayerObject: function(obj) {
		this.player = obj;
	},
	
	addPlayerLivesObject: function(obj) {
		this.playerLives.push(obj);
	},
	
	addCLaserObject: function(obj) {
		this.cLasers.push(obj);
	},
	
	addALaserObject: function(obj) {
		this.aLasers.push(obj);
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

	updateAll: function(ctx, elapsed) {
		// variables
		var i, j, laser, alien, barrier, obj, time=0, minTime, maxTime;
		var stillOnScreen = [];
		
		// keep the score
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, 50, 50);

		// keep track of total survival time
		this.totalMs += elapsed;

		
		// ##### MOVE LASERS #####
		
		// move cannon lasers
		for (i=0; i<this.cLasers.length; i++) {
			laser = this.cLasers[i];
			laser.move(0, -LASER_MOV);
		}

		// move alien lasers
		for (i=0; i<this.aLasers.length; i++) {
			laser = this.aLasers[i];
			laser.move(0, LASER_MOV);
		}
		
		
		// ##### CHECK FOR COLLISIONS #####

		// check for collisions - end the game if the cannon is touching any alien
		for (i=0; i<this.aliens.length; i++) {
			alien = this.aliens[i];
			if (this.player.isTouching(alien)) {
				$(explosion)[0].play();
				
				if (this.player.getLives() <= 0) {
					this.endGame();
				}
				else {
					this.player.destroyed();
					
					for (j=0; j<this.playerLives.length - 1; j++) {
						obj = this.playerLives[j];
					}
					this.playerLives = stillOnScreen;

				}
			}
		}
		
		// check for collisions - destroy any alien touched by a laser
		for (i=0; i<this.aliens.length; i++) {
			for (j=0; j<this.cLasers.length; j++) {
				if (this.aliens[i].isTouching(this.cLasers[j])) {
					this.score += this.aliens[i].getPoints();
					this.aliens[i].destroy();
					this.cLasers[j].move(0, -this.canvasHeight);
					$(invaderkilled)[0].play();
				}
			}
		}
		
		// check for collisions - barriers get damage if touched by a cannon laser
		for (i=0; i<this.barriers.length; i++) {
			for (j=0; j<this.cLasers.length; j++) {
				if (this.barriers[i].isTouching(this.cLasers[j])) {
					this.barriers[i].receiveDamage();
					this.cLasers[j].move(0, -this.canvasHeight);
				}
			}
		}

		// check for collisions - barriers get damage if touched by a alien laser
		for (i=0; i<this.barriers.length; i++) {
			for (j=0; j<this.aLasers.length; j++) {
				if (this.barriers[i].isTouching(this.aLasers[j])) {
					this.barriers[i].receiveDamage();
					this.aLasers[j].move(0, -this.canvasHeight);
				}
			}
		}
		
		// check for collisions - end the game if the cannon is touching any aliens laser
		for (i=0; i<this.aLasers.length; i++) {
			laser = this.aLasers[i];
			if (this.player.isTouching(laser)) {
				$(explosion)[0].play();
				
				if (this.player.getLives() <= 0) {
					this.endGame();
				}
				else {
					this.player.destroyed();
					
					for (j=0; j<this.playerLives.length - 1; j++) {
						obj = this.playerLives[j];
					}
					this.playerLives = stillOnScreen;
					
				}
			}
		}
		
		
		// ##### REMOVE OLD OBJECTS #####
		
		// remove cannon lasers that have gone off top of canvas
		for (i=0; i<this.cLasers.length; i++) {
			laser = this.cLasers[i];
			if (laser.getBottom() > 0) {
				stillOnScreen.push(laser);
			}
		}
		this.cLasers = stillOnScreen;
		
		// remove alien lasers that have gone off bottom of canvas
		var stillOnScreen = [];
		for (i=0; i<this.aLasers.length; i++) {
			laser = this.aLasers[i];
			if (laser.getTop() < this.canvasHeight) {
				stillOnScreen.push(laser);
			}
		}
		this.aLasers = stillOnScreen;
		
		// remove destroyed aliens from the "aliens" array
		stillOnScreen = [];
		for (i=0; i<this.aliens.length; i++) {
			alien = this.aliens[i];
			if (!alien.destroyed) {
				stillOnScreen.push(alien);
			}
		}
		this.aliens = stillOnScreen;
		
		// remove destroyed barriers from the "barriers" array
		stillOnScreen = [];
		for (i=0; i<this.barriers.length; i++) {
			barrier = this.barriers[i];
			if (!barrier.destroyed) {
				stillOnScreen.push(barrier);
			}
		}
		this.barriers = stillOnScreen;
		
		
		// ##### ADDS NEW OBJECTS #####
		
		// creates new aliens matrix
		if (this.aliens.length < 1) {
			this.level += 1;
			aliens_xmov_inc = this.level * 0.1;
			createAliensMatrix();
		}
	},
	
	drawAll: function(ctx) {
		// Some variables
		var i;
		
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
		
		// player's cannon
		this.drawObject(this.player, ctx);
		
		// cannon's lasers
		for (i=0; i<this.cLasers.length; i++) {
			this.drawObject(this.cLasers[i], ctx);
		}
		
		// alien's lasers
		for (i=0; i<this.aLasers.length; i++) {
			this.drawObject(this.aLasers[i], ctx);
		}
		
		// all alien objects
		for (i=0; i<this.aliens.length; i++) {
			this.drawObject(this.aliens[i], ctx);
		}
		
		// all barrier objects
		for (i=0; i<this.barriers.length; i++) {
			this.drawObject(this.barriers[i], ctx);
		}
		
		// The Score
		ctx.font = "12pt Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, 35, 25);
		
		// The Lives
		ctx.fillText("Lives: " , 400, 25);
		for (i=0; i<this.playerLives.length; i++) {
			this.drawObject(this.playerLives[i], ctx);
		}
	},
	
	endGame: function() {
		this.gameIsOver = true;
		// Show final message:
		$("#info").html("GAME OVER - Reload to play again.");
	}
};

// Creates all the objects
function createObjects(objCannon) {
	// Some variables
	var i, j, filename, width, heigth, points, dPos;

	// Put the player in the world
	TheWorld.addPlayerObject(objCannon);
	
	// Creates cannon objects that shows how many lives the player has
	for (i=0; i<3; i++) {
		TheWorld.addPlayerLivesObject(new Cannon(450 + i * 25, 5, 3, "images/cannon.png"));
	}
	
	// Creates some aliens objects
	createAliensMatrix();
	
	// Creates the barriers
	for (i=0; i<2; i++) {
		for (j=0; j<4; j++) {
			TheWorld.addBarrierObject(new Barrier(50+j*15, TheWorld.groundLevel-80 + i*15));
		}
	}
	for (i=0; i<2; i++) {
		for (j=0; j<4; j++) {
			TheWorld.addBarrierObject(new Barrier(170+j*15, TheWorld.groundLevel-80 + i*15));
		}
	}
	for (i=0; i<2; i++) {
		for (j=0; j<4; j++) {
			TheWorld.addBarrierObject(new Barrier(290+j*15, TheWorld.groundLevel-80 + i*15));
		}
	}
	for (i=0; i<2; i++) {
		for (j=0; j<4; j++) {
			TheWorld.addBarrierObject(new Barrier(410+j*15, TheWorld.groundLevel-80 + i*15));
		}
	}
};

// Creates the aliens matrix
function createAliensMatrix() {
	for (i=0; i<5; i++) {
		switch (i) {
			case 0:
				filename = "images/alien3.png";
				width = 16;
				heigth = 16;
				dPos = 4;
				points = 40;
			break;
			case 1:
				filename = "images/alien2.png";
				width = 22;
				heigth = 16;
				dPos = 1;
				points = 20;
			break;
			case 2:
				filename = "images/alien2.png";
				width = 22;
				heigth = 16;
				dPos = 1;
				points = 20;
			break;
			case 3:
				filename = "images/alien1.png";
				width = 24;
				heigth = 16;
				dPos = 0;
				points = 10;
			break;
			case 4:
				filename = "images/alien1.png";
				width = 24;
				heigth = 16;
				dPos = 0;
				points = 10;
			break;
		}
		for (j=0; j<11; j++) {
			TheWorld.addAlienObject(new Alien(100 + j*33 + dPos, 50 + i*33, width, heigth, points, filename));
		}
	}
}

// Main event whose function controls the game
$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
	var now = Date.now();
	
	// The cannon object
	var cannon = new Cannon(70, TheWorld.groundLevel-22, 3, "images/cannon.png");
	
	// Creates all the objects and adds them to the world
	createObjects(cannon);
	
	// Interval event for The World
	window.setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var elapsed = Date.now() - now;
			now = Date.now();
			TheWorld.updateAll(context, elapsed);
			TheWorld.drawAll(context);
		}
	}, THEWORLD_REDRAW_INTERVAL);

	// Interval event for aliens' movement
	var aliensMov = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var i;

			// Check the direction of the movement of the aliens based on the sides of the canvas
			for (i=0; i<TheWorld.aliens.length; i++) {
				if (TheWorld.aliens[i].getRight() <= TheWorld.canvasWidth && 
				   TheWorld.aliens[i].getRight() >= TheWorld.canvasWidth - ALIENS_XMOV-aliens_xmov_inc) {
					hFlag = "GO_LEFT";
					vFlag = "GO_DOWN";
					break;
				}
				else if (TheWorld.aliens[i].getLeft() >= 0 && 
						TheWorld.aliens[i].getLeft() <= ALIENS_XMOV+aliens_xmov_inc) {
					hFlag = "GO_RIGHT";
					vFlag = "GO_DOWN";
					break;
				}
			}
			
			// Move the aliens down once they reached either far left or far right side of the canvas
			if (vFlag == "GO_DOWN") {
				for (i=0; i<TheWorld.aliens.length; i++) {
					TheWorld.aliens[i].move(0, ALIENS_YMOV);
				}
				vFlag = "STAY";
				aliens_xmov_inc += 0.1;
			}
			
			//Move the aliens either to the left or right side of the canvas
			if (hFlag == "GO_RIGHT") {
				for (i=0; i<TheWorld.aliens.length; i++) {
					TheWorld.aliens[i].move(ALIENS_XMOV+aliens_xmov_inc, 0);
				}
			}
			else if (hFlag == "GO_LEFT") {
				for (i=0; i<TheWorld.aliens.length; i++) {
					TheWorld.aliens[i].move(-ALIENS_XMOV-aliens_xmov_inc, 0);
				}
			}
		}
	}, ALIENS_REDRAW_INTERVAL);
	
	// Interval event for cannon's movement
	var cannonMov = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			if (leftArrowDown && !rightArrowDown) {;
				(cannon.getLeft() >= CANNON_MOV) ? cannon.move(-CANNON_MOV, 0) : 0;
			}
			if (rightArrowDown && !leftArrowDown) {
				(cannon.getRight() <= TheWorld.canvasWidth-CANNON_MOV) ? cannon.move(CANNON_MOV, 0) : 0;
			}
			if (spaceBarDown) {
				cannon.fire();
			}
			TheWorld.drawAll(context);
		}
	}, CANNON_REDRAW_INTERVAL);

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
});