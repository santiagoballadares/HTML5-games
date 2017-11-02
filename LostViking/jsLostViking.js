//@Description: Lost Viking: Top down space shooter.
//@Autor: Santiago Balladares
//@Date: 24/04/2013

// Constants
const LEFT_ARROW = 37;		// move left
const UP_ARROW = 38;		  // move up
const RIGHT_ARROW = 39;		// move right
const DOWN_ARROW = 40;		// move down
const SPACE_BAR = 32;		  // shoot

const SPACE_COLOR = "#1F1F1F";

const STAR_MOV = 1;
const SHIP_MOV = 2;
const LASER_MOV = 3;
const ENEMIES_X_MOV = 30;
const ENEMIES_Y_MOV = 30;

const SHIP_REDRAW_INTERVAL = 1;
const ENEMIES_REDRAW_INTERVAL = 250;
const THEWORLD_REDRAW_INTERVAL = 25;

const ALIVE = 0;
const DESTROYED = 1;


// Global variables
var leftArrowDown = false;
var upArrowDown = false;
var rightArrowDown = false;
var downArrowDown = false;
var spaceBarDown = false;

var firstWaveOver = false;
var secondWaveOver = false;
var thirdWaveOver = false;

var livesAddedToScore = 0;

var rightFlag = true;

var time = 0;


// Star object & prototype
function Star(x, y) {
	this.x = x;
	this.y = y;
	this.width = 2;
	this.height = 2;
	this.color = "#FFFFFF";
}
Star.prototype = {
	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.width;
	},
	  
	getTop: function() {
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
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

// Ship object & prototype
function Ship(x, y, filename) {
	this.x = x;
	this.y = y;
	this.init(filename);
	this.width = 40;
	this.height = 40;
}
Ship.prototype = {
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
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
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
	
	shoot: function() {
		// creates new ship lasers
		TheWorld.addShipLaserObject(new Laser(this.getLeft()+this.width/2, this.getTop(), this.getLeft()+this.width/2, 0, "ship"));
		$(shoot)[0].play();
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	}
};

// Laser object & prototype
function Laser(x, y, targetX, targetY, from) {
  this.width = from == "ship" ? 1 : 5;
  this.height = from == "ship" ? 10 : 5;

  this.x = x;
  this.y = y;
  
  this.targetX = targetX;
  this.targetY = targetY;
  
  this.direction = (this.targetX >= this.x) ? 1 : -1;

  this.color = from == "ship" ? "#FFFFFF" : "#FF0000";
}
Laser.prototype = {
	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.width;
	},
	  
	getTop: function() {
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
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

// Enemy object & prototype
function Enemy(x, y, width, heigth, points, health, filename) {
	this.destroyed = false;
	this.visible = true;
	this.x = x;
	this.y = y;
	this.points = points;
	this.init(filename);
	this.width = width;
	this.height = heigth;
	this.animationFrame = 0;
	this.status = ALIVE;
	this.health = health;
}
Enemy.prototype = {
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
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
	},
	
	getPoints: function() {
		return this.points;
	},
	
	getStatus: function() {
		return this.status;
	},

	draw: function(ctx) {
		if (this.imgLoaded) {
			var spriteOffsetX, spriteOffsetY;
			
			// when destroyed, resets animationFrame, changes status, and visible flag
			if (this.destroyed) {
				this.animationFrame = 0;
				this.status = DESTROYED;
				this.visible = false;
			}

			switch (this.points) {
				case 40:
					spriteOffsetX = 24 * this.animationFrame;
					spriteOffsetY = 16 * this.status;
					ctx.drawImage(this.img, spriteOffsetX, spriteOffsetY, 24, 16, this.x, this.y, 24, 16);
				break;
				case 80:
					spriteOffsetX = 22 * this.animationFrame;
					spriteOffsetY = 16 * this.status;
					ctx.drawImage(this.img, spriteOffsetX, spriteOffsetY, 22, 16, this.x, this.y, 22, 16);
				break;
				case 100:
					spriteOffsetX = 16 * this.animationFrame;
					spriteOffsetY = 16 * this.status;
					ctx.drawImage(this.img, spriteOffsetX, spriteOffsetY, 16, 16, this.x, this.y, 16, 16);
				break;
				case 200:
					ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				break;
			}
		}
		else if (this.destroyed) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
	
	shoot: function() {
		if (!this.destroyed) {
			TheWorld.addEnemiesLaserObject(new Laser(this.getLeft()+this.width/2, this.getBottom(), TheWorld.player.getLeft(), TheWorld.player.getTop(), "enemy"));
		}
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() >= other.getTop() && other.getBottom() >= this.getTop());
	},
	
	destroy: function() {
		this.destroyed = true;
	}
};


// The World
var TheWorld = {
	canvasWidth: 450,
	canvasHeight: 550,

	gameIsOver: false,
	
	score: 0,
	playerLives: 3,
	playerLivesIcon: null,
	
	totalMs: 0,
	
	stars: [],				  // list of stars
	player: null,			  // player's ship object
	shipLasers: [],			// list of ship's lasers on canvas
	enemiesLasers: [],	// list of enemies's lasers on canvas
	enemiesWave1: [],		// list of wave 1 of enemies
	enemiesWave2: [],		// list of wave 2 of enemies
	enemiesWave3: [],		// list of wave 3 of enemies
	finalEnemy: null,		// final enemy

	addStarObject: function(obj) {
		this.stars.push(obj);
	},
	
	addPlayerObject: function(obj) {
		this.player = obj;
	},
	
	addShipLaserObject: function(obj) {
		this.shipLasers.push(obj);
	},
	
	addEnemiesLaserObject: function(obj) {
		this.enemiesLasers.push(obj);
	},

	addEnemyWave1Object: function(obj) {
		this.enemiesWave1.push(obj);
	},
	
	addEnemyWave2Object: function(obj) {
		this.enemiesWave2.push(obj);
	},
	
	addEnemyWave3Object: function(obj) {
		this.enemiesWave3.push(obj);
	},

	drawObject: function(obj, ctx) {
		obj.draw(ctx);
	},

	// Update objects
	updateAll: function(ctx, elapsedTime) {
		// variables
		var i, j, laser, enemy, obj;
		var stillOnScreen = [], allEnemies = [];
		
		// keep the score
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, 20, 20);
		
		// add lives
		if (Math.floor(this.score/1000) >= (livesAddedToScore+1)) {
			this.playerLives += 1;
			livesAddedToScore += 1;
		}
		
		// keep track of total survival time
		this.totalMs += elapsedTime;
		
		
		// ##### MOVE LASERS #####
		
		// move stars
		for (i=0; i<this.stars.length; ++i) {
			this.stars[i].move(0, STAR_MOV);
		}
		
		// move ship's lasers
		for (i=0; i<this.shipLasers.length; ++i) {
			laser = this.shipLasers[i];
			laser.move(0, -LASER_MOV);
		}

		// move enemies' lasers
		for (i=0; i<this.enemiesLasers.length; ++i) {
			laser = this.enemiesLasers[i];
			
			if (laser.targetX == laser.x) {
				laser.move(0, LASER_MOV);
			}
			else {
				// Two point linear equation: (y - y1) = (y2 - y1) / (x2 - x1) * (x - x1)
				// where slope: m = (y2 - y1) / (x2 - x1)
				// and y = mx - mx1 + y1
				var m, x, y;
				
				m = (laser.targetY - laser.y) / (laser.targetX - laser.x);
				
				x = laser.x + laser.direction * LASER_MOV;
				y = m * x - m * laser.x + laser.y;
				
				laser.move(x-laser.x, y-laser.y);		// subtract current position to get delta values
			}
		}
		
		
		// ##### CHECK FOR COLLISIONS #####

		// enemies' collisions with ship's laser - destroy any enemy touched by a laser
		for (i=0; i<this.enemiesWave1.length; ++i) {
			allEnemies.push(this.enemiesWave1[i]);
		}
		for (i=0; i<this.enemiesWave2.length; ++i) {
			allEnemies.push(this.enemiesWave2[i]);
		}
		for (i=0; i<this.enemiesWave3.length; ++i) {
			allEnemies.push(this.enemiesWave3[i]);
		}
		
		for (i=0; i<allEnemies.length; ++i) {
			for (j=0; j<this.shipLasers.length; ++j) {
				if (allEnemies[i].isTouching(this.shipLasers[j])) {
					this.score += allEnemies[i].getPoints();
					allEnemies[i].destroy();
					this.shipLasers[j].move(0, -this.canvasHeight);			// move laser out of canvas, so it's removed
					$(invaderkilled)[0].play();
				}
			}
		}

		// enemies' collisions with ship - decrease player's lives. ends game if player has no more lives
		for (i=0; i<allEnemies.length; ++i) {
			enemy = allEnemies[i];
			if (this.player.isTouching(enemy)) {
				enemy.destroy();
				$(explosion)[0].play();

				if (this.playerLives > 0) {
					this.playerLives = this.playerLives - 1;
				}
				else {
					this.endGame();
				}
			}
		}

		// enemies' lasers with ship - decrease player's lives. ends game if player has no more lives
		for (i=0; i<this.enemiesLasers.length; i++) {
			laser = this.enemiesLasers[i];
			if (this.player.isTouching(laser)) {
				this.playerLives != 0 ? laser.move(-this.canvasWidth, -this.canvasHeight) : 0;			// move laser out of canvas, so it's removed
				$(explosion)[0].play();
				
				if (this.playerLives > 0) {
					this.playerLives = this.playerLives - 1;
				}
				else {
					this.endGame();
				}
			}
		}

		// final enemy collision with ship's laser
		for (i=0; i<this.shipLasers.length; ++i) {
			if (this.finalEnemy.isTouching(this.shipLasers[i])) {
				this.finalEnemy.health -= 1;
				if (this.finalEnemy.health <= 0) {
					this.score += this.finalEnemy.getPoints();
					this.finalEnemy.destroy();
					this.shipLasers[i].move(0, -this.canvasHeight);			// move laser out of canvas, so it's removed
					$(invaderkilled)[0].play();
				}
			}
		}

		// final enemy collisions with ship - decrease player's lives. ends game if player has no more lives
		if (this.player.isTouching(this.finalEnemy)) {
			$(explosion)[0].play();

			if (this.playerLives > 0) {
				this.playerLives = this.playerLives - 1;
			}
			else {
				this.endGame();
			}
		}
		
		
		// ##### REMOVE OLD OBJECTS #####

		// remove stars
		stillOnScreen = [];
		for (i=0; i<this.stars.length; ++i) {
			if (this.stars[i].getTop() < this.canvasHeight) {
				stillOnScreen.push(this.stars[i]);
			}
		}
		this.stars = stillOnScreen;
		
		// remove ship lasers that have gone off of canvas
		stillOnScreen = [];
		for (i=0; i<this.shipLasers.length; ++i) {
			laser = this.shipLasers[i];
			if (laser.getBottom() > 0) {
				stillOnScreen.push(laser);
			}
		}
		this.shipLasers = stillOnScreen;
		
		// remove alien lasers that have gone off of canvas
		stillOnScreen = [];
		for (i=0; i<this.enemiesLasers.length; ++i) {
			laser = this.enemiesLasers[i];
			if (laser.getTop() < this.canvasHeight ||
				laser.getLeft() < 0 ||
				laser.getRight() < this.canvasWidth) {
				stillOnScreen.push(laser);
			}
		}
		this.enemiesLasers = stillOnScreen;
		
		// remove destroyed enemies on wave 1
		stillOnScreen = [];
		for (i=0; i<this.enemiesWave1.length; ++i) {
			enemy = this.enemiesWave1[i];
			if (enemy.visible) {
				stillOnScreen.push(enemy);
			}
		}
		this.enemiesWave1 = stillOnScreen;

		// remove destroyed enemies on wave 2
		stillOnScreen = [];
		for (i=0; i<this.enemiesWave2.length; ++i) {
			enemy = this.enemiesWave2[i];
			if (enemy.visible) {
				stillOnScreen.push(enemy);
			}
		}
		this.enemiesWave2 = stillOnScreen;

		// remove destroyed enemies on wave 3
		stillOnScreen = [];
		for (i=0; i<this.enemiesWave3.length; ++i) {
			enemy = this.enemiesWave3[i];
			if (enemy.visible) {
				stillOnScreen.push(enemy);
			}
		}
		this.enemiesWave3 = stillOnScreen;

		// final enemy
		if (!this.finalEnemy.visible) {
			this.winGame();
		}
			

		// ##### CLEAN ENEMIES ARRAYS AND SET FLAGS FOR NEXT WAVES #####
		
		// First wave
		var count = 0;
		if (this.enemiesWave1.length <= 0) {
			firstWaveOver = true;
		}
		else {
			for (i=0; i<this.enemiesWave1.length; ++i) {
				if (this.enemiesWave1[i].getLeft() > this.canvasWidth &&
					this.enemiesWave1[i].getBottom() < 0) {
					++count;
				}
			}

			if (this.enemiesWave1.length == count) {		// check that all enemies on current wave are out of canvas
				this.enemiesWave1 = [];						        // empty array
				firstWaveOver = true;
			}
		}

		// Second wave
		count = 0;
		if (this.enemiesWave2.length <= 0) {
			secondWaveOver = true;
		}
		else {
			for (i=0; i<this.enemiesWave2.length; ++i) {
				if (this.enemiesWave2[i].getBottom() < 0) {
					++count;
				}
			}

			if (this.enemiesWave2.length == count) {		// check that all enemies on current wave are out of canvas
				this.enemiesWave2 = [];						        // empty array
				secondWaveOver = true;
			}
		}

		// Third wave
		count = 0;
		if (this.enemiesWave3.length <= 0) {
			thirdWaveOver = true;
		}
		else {
			for (i=0; i<this.enemiesWave3.length; ++i) {
				if (this.enemiesWave3[i].getBottom() < 0) {
					++count;
				}
			}

			if (this.enemiesWave3.length == count) {		// check that all enemies on current wave are out of canvas
				this.enemiesWave3 = [];						        // empty array
				thirdWaveOver = true;
			}
		}


		// ##### ADD NEW OBJECTS #####

		// Add stars
		if (TheWorld.stars.length < 200) {
			var x = Math.floor(Math.random() * this.canvasWidth);
			TheWorld.addStarObject(new Star(x, 0));
		}
		
		// Add enemies' lasers
		time += elapsedTime;
		
		if (time > 1000 ) {	
			for (i=0; i<this.enemiesWave1.length; ++i) {
				if (this.enemiesWave1[i].getLeft() > 0 && this.enemiesWave1[i].getRight() < this.canvasWidth &&
					this.enemiesWave1[i].getTop() > 0 && this.enemiesWave1[i].getBottom() < this.canvasHeight) {
					var value = Math.floor(Math.random() * 10) % 2;
					if (value == 1) {
						this.enemiesWave1[i].shoot();
					}
				}
			}
			
			for (i=0; i<this.enemiesWave2.length; ++i) {
				if (this.enemiesWave2[i].getLeft() > 0 && this.enemiesWave2[i].getRight() < this.canvasWidth &&
					this.enemiesWave2[i].getTop() > 0 && this.enemiesWave2[i].getBottom() < this.canvasHeight) {
					var value = Math.floor(Math.random() * 10) % 2;
					if (value == 1) {
						this.enemiesWave2[i].shoot();
					}
				}
			}
			
			for (i=0; i<this.enemiesWave3.length; ++i) {
				if (this.enemiesWave3[i].getLeft() > 0 && this.enemiesWave3[i].getRight() < this.canvasWidth &&
					this.enemiesWave3[i].getTop() > 0 && this.enemiesWave3[i].getBottom() < this.canvasHeight) {
					var value = Math.floor(Math.random() * 10) % 2;
					if (value == 1) {
						this.enemiesWave3[i].shoot();
					}
				}
			}
			
			if (this.finalEnemy.getLeft() > 0 && this.finalEnemy.getRight() < this.canvasWidth &&
				this.finalEnemy.getTop() > 0 && this.finalEnemy.getBottom() < this.canvasHeight) {
				this.finalEnemy.shoot();
			}
			
			time = 0;
		}

	},
	
	drawAll: function(ctx) {
		var i;
		
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		// Space
		ctx.fillStyle = SPACE_COLOR;
		ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		// The Score
		ctx.font = "10pt Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + this.score, 20, 20);
		
		// The Lives
		this.drawObject(this.playerLivesIcon, ctx);
		ctx.fillText("x " + this.playerLives, 400, 20);
		
		// stars
		for (i=0; i<this.stars.length; ++i) {
			this.drawObject(this.stars[i], ctx);
		}

		// player's ship
		this.drawObject(this.player, ctx);
		
		// ship's lasers
		for (i=0; i<this.shipLasers.length; ++i) {
			this.drawObject(this.shipLasers[i], ctx);
		}
		
		// enemies' lasers
		for (i=0; i<this.enemiesLasers.length; ++i) {
			this.drawObject(this.enemiesLasers[i], ctx);
		}
		
		// wave 1 of enemies
		for (i=0; i<this.enemiesWave1.length; ++i) {
			this.drawObject(this.enemiesWave1[i], ctx);
		}
		
		// wave 2 of enemies
		for (i=0; i<this.enemiesWave2.length; ++i) {
			this.drawObject(this.enemiesWave2[i], ctx);
		}
		
		// wave 3 of enemies
		for (i=0; i<this.enemiesWave3.length; ++i) {
			this.drawObject(this.enemiesWave3[i], ctx);
		}
		
		// final enemy
		this.drawObject(this.finalEnemy, ctx);
	},

	endGame: function() {
		this.gameIsOver = true;
		// Show final message:
		$("#info").html("GAME OVER - Reload to play again.");
	},
	
	winGame: function() {
		this.gameIsOver = true;
		// Show final message:
		$("#info").html("CONGRATULATIONS - Reload to play again.");
	}
};

// Creates all the objects
function createObjects(objShip) {
	var i;

	// Player lives icon
	TheWorld.playerLivesIcon = new Ship(350, 3, "images/viking.png");

	// Put the stars
	for (i=0; i<200; ++i) {
		var x, y;
		x = Math.floor(Math.random() * TheWorld.canvasWidth);
		y = Math.floor(Math.random() * TheWorld.canvasHeight);
		TheWorld.addStarObject(new Star(x, y));
	}

	// Put the player in the world
	TheWorld.addPlayerObject(objShip);

	// Enemy variables
	var filename, width, heigth, points, health;

	// Create wave 1 of enemies
	filename = "images/alien1.png";
	width = 24;
	heigth = 16;
	points = 40;
	health = 20;
	for (i=1; i<=10; ++i) {
		TheWorld.addEnemyWave1Object(new Enemy(0 - i*70, 0 - i*70, width, heigth, points, health, filename));
	}
	
	// Create wave 2 of enemies
	filename = "images/alien2.png";
	width = 22;
	heigth = 16;
	points = 80;
	health = 40;
	for (i=1; i<=15; ++i) {
		TheWorld.addEnemyWave2Object(new Enemy(0 - i*70, TheWorld.canvasHeight/3*2 + i*70, width, heigth, points, health, filename));
	}
	
	// Create wave 3 of enemies
	filename = "images/alien2.png";
	width = 22;
	heigth = 16;
	points = 80;
	health = 40;
	for (i=1; i<=15; ++i) {
		TheWorld.addEnemyWave3Object(new Enemy(TheWorld.canvasWidth + i*70, TheWorld.canvasHeight/3*2 + i*70, width, heigth, points, health, filename));
	}
	
	// Final enemy
	filename = "images/mothership.png";
	width = 100;
	heigth = 80;
	points = 200;
	health = 100;
	TheWorld.finalEnemy = new Enemy(TheWorld.canvasWidth/2, -100, width, heigth, points, health, filename);
};


// Main event whose function controls the game
$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
	var now = Date.now();
	
	// The ship object
	var ship = new Ship(TheWorld.canvasWidth/2-20, TheWorld.canvasHeight-40, "images/viking.png");
	
	// Creates all the objects and adds them to the world
	createObjects(ship);
	
	// Interval event for The World
	window.setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var elapsed = Date.now() - now;
			now = Date.now();
			TheWorld.updateAll(context, elapsed);
			TheWorld.drawAll(context);
		}
	}, THEWORLD_REDRAW_INTERVAL);

	
	// Interval event for ship's movement
	var shipMov = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			if (leftArrowDown) {;
				(ship.getLeft() >= SHIP_MOV) ? ship.move(-SHIP_MOV, 0) : 0;
			}
			if (upArrowDown) {
				(ship.getTop() >= 0) ? ship.move(0, -SHIP_MOV) : 0;
			}
			if (rightArrowDown) {
				(ship.getRight() <= TheWorld.canvasWidth-SHIP_MOV) ? ship.move(SHIP_MOV, 0) : 0;
			}
			if (downArrowDown) {
				(ship.getBottom() <= TheWorld.canvasHeight) ? ship.move(0, SHIP_MOV) : 0;
			}
			if (spaceBarDown) {
				ship.shoot();
				spaceBarDown = false;
			}
			TheWorld.drawAll(context);
		}
	}, SHIP_REDRAW_INTERVAL);

	// Interval event for movement of wave 1 of enemies
	var enemiesWave1Mov = setInterval(function() {
		if (!TheWorld.gameIsOver) {
			var i;
			
			for (i=0; i<TheWorld.enemiesWave1.length; ++i) {
				if (TheWorld.enemiesWave1[i].getRight() <= TheWorld.canvasWidth/2) {
					TheWorld.enemiesWave1[i].move(ENEMIES_X_MOV, ENEMIES_Y_MOV);
				}
				else {
					TheWorld.enemiesWave1[i].move(ENEMIES_X_MOV, -ENEMIES_Y_MOV);
				}
			}
			
		}
	}, ENEMIES_REDRAW_INTERVAL);

	// Interval event for movement of wave 2 of enemies
	var enemiesWave2Mov = setInterval(function() {
		if (!TheWorld.gameIsOver && firstWaveOver) {
			var i;

			for (i=0; i<TheWorld.enemiesWave2.length; ++i) {
				if (TheWorld.enemiesWave2[i].getRight() <= TheWorld.canvasWidth/2) {
					TheWorld.enemiesWave2[i].move(ENEMIES_X_MOV, -ENEMIES_Y_MOV);
				}
				else {
					TheWorld.enemiesWave2[i].move(-ENEMIES_X_MOV, -ENEMIES_Y_MOV);
				}
			}
			
		}
	}, ENEMIES_REDRAW_INTERVAL);

	// Interval event for movement of wave 3 of enemies
	var enemiesWave3Mov = setInterval(function() {
		if (!TheWorld.gameIsOver && secondWaveOver) {
			var i;

			for (i=0; i<TheWorld.enemiesWave3.length; ++i) {
				if (TheWorld.enemiesWave3[i].getLeft() >= TheWorld.canvasWidth/2) {
					TheWorld.enemiesWave3[i].move(-ENEMIES_X_MOV, -ENEMIES_Y_MOV);
				}
				else {
					TheWorld.enemiesWave3[i].move(ENEMIES_X_MOV, -ENEMIES_Y_MOV);
				}
			}
			
		}
	}, ENEMIES_REDRAW_INTERVAL);

	// Interval event for movement of final enemy
	var finalEnemyMov = setInterval(function() {
		if (!TheWorld.gameIsOver && thirdWaveOver) {

			if (TheWorld.finalEnemy.getTop() <= 120) {
				TheWorld.finalEnemy.move(0, ENEMIES_Y_MOV);
			}
			
			if (rightFlag) {
				TheWorld.finalEnemy.move(ENEMIES_X_MOV, 0);
				
				if (TheWorld.finalEnemy.getRight() > TheWorld.canvasWidth - 50) {
					rightFlag = false;
				}
			}
			else {
				TheWorld.finalEnemy.move(-ENEMIES_X_MOV, 0);
				
				if (TheWorld.finalEnemy.getLeft() < 50) {
					rightFlag = true;
				}
			}	
			
		}
	}, ENEMIES_REDRAW_INTERVAL);
	
	
	// Keydown event
	$(document).bind("keydown", function(evt) {
		if (evt.which == LEFT_ARROW) {
			leftArrowDown = true;
		}
		if (evt.which == UP_ARROW) {
			upArrowDown = true;
		}
		if (evt.which == RIGHT_ARROW) {
			rightArrowDown = true;
		}
		if (evt.which == DOWN_ARROW) {
			downArrowDown = true;
		}
	});

	// Keyup event
	$(document).bind("keyup", function(evt) {
		if (evt.which == LEFT_ARROW) {
			leftArrowDown = false;
		}
		if (evt.which == UP_ARROW) {
			upArrowDown = false;
		}
		if (evt.which == RIGHT_ARROW) {
			rightArrowDown = false;
		}
		if (evt.which == DOWN_ARROW) {
			downArrowDown = false;
		}
	});
	
	// Keypress event
	$(document).bind("keypress", function(evt) {
		if (evt.which == SPACE_BAR) {
			spaceBarDown = true;
		}
	});
});