// Constants
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACE_BAR = 32;

const SKY_COLOR = "#1F1F1F";
const GROUND_COLOR = "#1A3300";

const VOLOCITY = 0.5;
const REDRAW_INTERVAL = 25;

// Global variables
var leftArrowDown = false;
var rightArrowDown = false;
var spaceBarDown = false;
var Hflag = "GO_RIGHT";
var Vflag = "STAY";

// Laser Cannon object & prototype
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
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
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
		var laser = new CannonLaser(this.x+this.width/2,this.y);
	},
	
	destroyed: function() {
		if (this.lives > 0) {
			this.lives -= 1;
		}
	}
};

function CannonLaser(x, y) {
  this.width = 3;
  this.height = 10;

  this.x = x;
  this.y = y;

  this.vx = 0;
  this.vy = 0;

  this.color = "#000000";
}
CannonLaser.prototype = {
  update: function(elapsedMs) {
    this.x += this.vx * elapsedMs / REDRAW_INTERVAL;
    this.y += this.vy * elapsedMs / REDRAW_INTERVAL;

    this.vy += VOLOCITY * elapsedMs / REDRAW_INTERVAL;
  },

  draw: function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.left, this.top, this.width, this.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.left, this.top, this.width, this.height);
  },

  get top() {
    return this.y - this.height;
  },

  get bottom() {
    return this.y;
  },

  get left() {
    return this.x;
  },

  get right() {
    return this.x + this.width;
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
		return this.y;
	},
	
	getBottom: function() {
		return this.y + this.height;
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
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			}
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
	
	}
};

// Barrier object & prototype

// The World
var TheWorld = {
	canvasWidth: 550,
	canvasHeight: 450,
	groundLevel: 425,

	gameIsOver: false,
	
	totalMs: 0,
	
	player: null,
	aliens: [],
	barriers: [],

	addPlayerObject: function(obj) {
		this.player = obj;
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

	draw: function(ctx) {
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
		
		var i;
		// draw player's laser cannon
		this.drawObject(this.player, ctx);
		// draw all the aliens objects
		for (i=0; i<this.aliens.length; i++) {
			this.drawObject(this.aliens[i], ctx);
		}
		// Draw all the barriers objects
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

// Interval that controls the aliens' movement across the canvas
var m = setInterval(function() {
	var i;
	
	// Check the direction of the movement of the aliens based on the sides of the canvas
	for(i=0; i<TheWorld.aliens.length; i++) {
		if(TheWorld.aliens[i].x + TheWorld.aliens[i].width <= TheWorld.canvasWidth && 
		   TheWorld.aliens[i].x + TheWorld.aliens[i].width >= TheWorld.canvasWidth - 5) {
			Hflag = "GO_LEFT";
			Vflag = "GO_DOWN";
			break;
		}
		else if(TheWorld.aliens[i].x >= 0 && 
		        TheWorld.aliens[i].x <= 5) {
			Hflag = "GO_RIGHT";
			Vflag = "GO_DOWN";
			break;
		}
	}
	
	// Move the aliens down once they reached either far left or far right side of the canvas
	if(Vflag == "GO_DOWN") {
		for(i=0; i<TheWorld.aliens.length; i++) {
			if(TheWorld.aliens[i].destroyed == 0) {
				TheWorld.aliens[i].move(0, 10);
			}
		}
		Vflag = "STAY";
	}
	
	//Move the aliens either to the left or right side of the canvas
	if(Hflag == "GO_RIGHT") {
		for(i=0; i<TheWorld.aliens.length; i++) {
			if(TheWorld.aliens[i].destroyed == 0) {
				TheWorld.aliens[i].move(3, 0);
			}
		}
	}
	else if(Hflag == "GO_LEFT") {
		for(i=0; i<TheWorld.aliens.length; i++) {
			if(TheWorld.aliens[i].destroyed == 0) {
				TheWorld.aliens[i].move(-3, 0);
			}
		}
	}
}, 50);

// Main event whose function controls the game
$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
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
	
	TheWorld.aliens[1].destroyed = 1;
	
	TheWorld.draw(context);
	
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
		TheWorld.draw(context);
		if (leftArrowDown && !rightArrowDown) {;
			(cannon.x >= 5) ? cannon.move(-5, 0) : 0;
		}
		if (rightArrowDown && !leftArrowDown) {
			(cannon.x <= TheWorld.canvasWidth-cannon.width-5) ? cannon.move(5, 0) : 0;
		}
		if (spaceBarDown) {
			cannon.fire;
		}
	}, 1);
});