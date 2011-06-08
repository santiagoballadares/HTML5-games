// @Description: Implements Physics - shoots a bullet with increasing velocity and throws a grenade with x & y vectors for velocity and gravity
// @Autor: Santiago Balladares
// @Date: 07/06/2011 20:34

// Constants
const LEFT_ARROW = 37;		// move left
const RIGHT_ARROW = 39;		// move right
const SPACE_BAR = 32;		// fire
const CTRL_KEY = 17;		// throw grenade

const GOING_RIGHT = 0;
const GOING_LEFT = 1;
const STAND_STILL = 2;

const BULLET_VEL = 5;

const GRAVITY = 0.5;
const GRENADE_VEL = 1;

const REDRAW_INTERVAL = 75;

// Global variables
var leftArrowDown = false;
var rightArrowDown = false;
var spaceBarDown = false;
var ctrlKeyDown = false;

// Player Object & Prototype
function Player(x, y, filename) {
	this.x = x;
	this.y = y - 44;
	this.width = 36;
	this.height = 44;
	this.animationFrame = 0;
	this.movementDirection = STAND_STILL;
	this.init(filename);
}
Player.prototype = {
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
	  
	draw: function(ctx) {
		if (this.imgLoaded) {
			var spriteOffsetX = 36 * this.animationFrame;
			var spriteOffsetY = 44 * this.movementDirection;
			ctx.drawImage(this.img, spriteOffsetX, spriteOffsetY, 36, 44, this.x, this.y, 36, 44);
		}
	},
	
	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},

	move: function(dx, dy) {
		this.animationFrame = (this.animationFrame + 1) % 12;
		if (dx < 0) {
			this.movementDirection = GOING_LEFT;
		}
		if (dx > 0) {
			this.movementDirection = GOING_RIGHT;
		}
		this.x += dx;
		this.y += dy;
	},

	idle: function() {
		this.animationFrame = 0;
		this.movementDirection = STAND_STILL;
	},
	
	fire: function() {
		if(TheWorld.bullets.length < 1) {
			TheWorld.bullets.push(new Bullet(this.getRight() - 10, this.y + 20, "images/bullet.png"));
		}
	},
	
	throwGrenade: function() {
		if(TheWorld.grenades.length < 1) {
			TheWorld.grenades.push(new Grenade(this.getRight() - 10, this.y + 10, "images/grenade.png"));
		}
	}
};

// Bullet object & prototype
function Bullet(x, y, filename) {
	this.x = x;
	this.y = y - 4;
	this.width = 7;
	this.height = 4;
	this.init(filename);
	this.vx = 0;
	this.vy = 0;
}
Bullet.prototype = {
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
		if (this.imgLoaded) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	},
	
	update: function(elapsedMs) {
		this.x += this.vx * elapsedMs / REDRAW_INTERVAL;
		this.y += this.vy * elapsedMs / REDRAW_INTERVAL;

		this.vx += BULLET_VEL * elapsedMs / REDRAW_INTERVAL;
	},
	move: function(dx, dy) {
		this.x += dx;
		this.y += dy;
	},
	
	isTouching: function(other) {
		return (this.getRight() >= other.getLeft() && other.getRight() >= this.getLeft() &&
				this.getBottom() <= other.getTop() && other.getBottom() <= this.getTop());
	}
};

// Grenade object & prototype
function Grenade(x, y, filename) {
	this.x = x;
	this.y = y - 19;
	this.width = 19;
	this.height = 19;
	this.init(filename);
	
	this.vx = 3;		// initial velocity on x axis
	this.vy = -4;		// initial velocity on y axis
	this.vxMax = 5;		// max velocity on x axis
	
	this.animationFrame = 0;
}
Grenade.prototype = {
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
		if (this.imgLoaded) {
			var spriteOffsetX = 19 * this.animationFrame;
			ctx.drawImage(this.img, spriteOffsetX, 0, 19, 19, this.x, this.y, 19, 19);
			//ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	},
	
	update: function(elapsedMs) {
		this.animationFrame = (this.animationFrame + 1) % 4;
		
		this.x += this.vx * elapsedMs / REDRAW_INTERVAL;
		this.y += this.vy * elapsedMs / REDRAW_INTERVAL;

		// Velocity on x axis have a maximum, once reached it, the x velocity will decrease
		if (this.vx < this.vxMax) {
			this.vx += GRENADE_VEL * elapsedMs / REDRAW_INTERVAL;
		}
		else {
			this.vx -= GRENADE_VEL * elapsedMs / REDRAW_INTERVAL;
		}
		this.vy += GRAVITY * elapsedMs / REDRAW_INTERVAL;
	}
};

// Enemy Object & Prototype
function Enemy(x, y, filename) {
	this.alive = true;
	this.x = x;
	this.y = y - 62;
	this.width = 73;
	this.height = 62;
	this.animationFrame = 0;
	this.init(filename);
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
		return this.y + this.height;
	},
	
	getBottom: function() {
		return this.y;
	},
	
	draw: function(ctx) {
		if (this.imgLoaded && this.alive) {
			var spriteOffsetX = 73 * this.animationFrame;
			ctx.drawImage(this.img, spriteOffsetX, 0, 73, 62, this.x, this.y, 73, 62);
		}
	},
	
	erase: function(ctx) {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	},

	update: function() {
		this.animationFrame = (this.animationFrame + 1) % 10;
	},
	
	killed: function() {
		this.alive = false;
	}
};

// The World
var TheWorld = {
	canvasWidth: 800,
	canvasHeight: 450,
	groundLevel: 400,
	
	player: null,
	bullets: [],
	grenades: [],
	enemies: [],

	// Background Drawing Function
	drawBackground: function(ctx) {
		// Initialize Context
		ctx.strokeStyle = "black";
		ctx.strokeWidth = 1;

		// sky
		ctx.fillStyle = "#99CCFF";
		ctx.fillRect(0, 0, this.canvasWidth, 300);

		// ground
		ctx.fillStyle = "#FFCC66";
		ctx.fillRect(0, 300, this.canvasWidth, 150);

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
		ctx.lineTo(this.canvasWidth, 300);
		ctx.stroke();
		
		// border line
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.canvasWidth, 0);
		ctx.lineTo(this.canvasWidth, this.canvasHeight);
		ctx.lineTo(0, this.canvasHeight);
		ctx.lineTo(0, 0);
		ctx.stroke();
	},

	updateAll: function(elapsed) {
		var i, j, bullet, grenade, enemy;
		
		// keep track of time
		this.totalMs += elapsed;

		// update bullets
		for (i=0; i<this.bullets.length; i++) {
			bullet = this.bullets[i];
			bullet.update(elapsed)	;
		}
		
		// update grenades
		for (i=0; i<this.grenades.length; i++) {
			grenade = this.grenades[i];
			grenade.update(elapsed)	;
		}

		// remove bullets that have gone off right of canvas
		var stillOnScreen = [];
		for (i=0; i<this.bullets.length; i++) {
			bullet = this.bullets[i];
			if (bullet.getLeft() < this.canvasWidth) {
				stillOnScreen.push(bullet);
			}
		}
		this.bullets = stillOnScreen;
		
		// remove grenades that have gone off bottom of canvas
		stillOnScreen = [];
		for (i=0; i<this.grenades.length; i++) {
			grenade = this.grenades[i];
			if (grenade.getTop() < this.canvasHeight) {
				stillOnScreen.push(grenade);
			}
		}
		this.grenades = stillOnScreen;
		
		// update enemies
		for (i=0;i<this.enemies.length; i++) {
			this.enemies[i].update();
		}

		// check for collisions - hide enemies and bullets
		for (i=0; i<this.bullets.length; i++) {
			for (j=0; j<this.enemies.length; j++) {
				if (this.bullets[i].isTouching(this.enemies[j])) {
					this.bullets[i].move(this.canvasWidth, 100);
					this.enemies[j].killed();
				}
			}
		}
		
		// remove killed enemies from the "enemies" array
		stillOnScreen = [];
		for (i=0; i<this.enemies.length; i++) {
			enemy = this.enemies[i];
			if (enemy.alive) {
				stillOnScreen.push(enemy);
			}
		}
		this.enemies = stillOnScreen;
	},
	
	drawAll: function(ctx) {
		// Draw background
		this.drawBackground(ctx);
		
		// Draw player
		this.player.draw(ctx);
		
		// Draw bullets
		for (i=0; i<this.bullets.length; i++) {
			this.bullets[i].draw(ctx);
		}
		
		// Draw grenades
		for (i=0; i<this.grenades.length; i++) {
			this.grenades[i].draw(ctx);
		}
		
		// Draw enemies
		for (i=0; i<this.enemies.length; i++) {
			this.enemies[i].draw(ctx);
		}
	}
};

$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
	var now = Date.now();
	var player = new Player(10, TheWorld.groundLevel, "images/marco.png");

	// Put the player in the world:
	TheWorld.player = player;

	// Add some enemy to the world:
	TheWorld.enemies.push(new Enemy(300, TheWorld.groundLevel, "images/enemy.png"));
	TheWorld.enemies.push(new Enemy(500, TheWorld.groundLevel, "images/enemy.png"));
	TheWorld.enemies.push(new Enemy(700, TheWorld.groundLevel, "images/enemy.png"));
	
	window.setInterval(function() {
		var elapsed = Date.now() - now;
		now = Date.now();
		TheWorld.updateAll(elapsed);
		TheWorld.drawAll(context);
	}, REDRAW_INTERVAL);
	
	var playerInterval = setInterval(function() {
		if (leftArrowDown && !rightArrowDown) {
			player.move(-10, 0);
		}
		if (rightArrowDown && !leftArrowDown) {
			player.move(10, 0);
		}
		if(!leftArrowDown && !rightArrowDown) {
			player.idle();
		}
		if (spaceBarDown) {
			player.fire();
		}
		if (ctrlKeyDown) {
			player.throwGrenade();
		}
		TheWorld.drawAll(context);
	}, REDRAW_INTERVAL);

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
		if (evt.which == CTRL_KEY) {
			ctrlKeyDown = true;
		}
	});

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
		if (evt.which == CTRL_KEY) {
			ctrlKeyDown = false;
		}
	});
});