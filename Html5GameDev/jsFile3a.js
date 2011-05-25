// Constants
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const GROUND_COLOR = "#138900";
const WATER_COLOR = "#408DD2";
const MOUNTAINS_COLOR = "#613F1C";
const LEAF_COLOR = "#1F5017";
const TRUNK_COLOR = "#5E3F18";
const STONE_COLOR = "#817D85";

// Global variables
var up, down, left, right;

// A mountain background scenery object with getLeft, getRight, getTop, getBottom, and draw methods:
function Mountain(x, y, height, width) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.left = x;
	this.right = x + width;
	this.top = y - height;
	this.bottom = y;
}
Mountain.prototype = {
	getLeft: function() {
		return this.left;
	},
	
	getRight: function() {
		return this.right;
	},
	
	getTop: function() {
		return this.top;
	},
	
	getBottom: function() {
		return this.bottom;
	},
	
	draw: function(ctx) {
		ctx.fillStyle = MOUNTAINS_COLOR;
		ctx.beginPath();
		ctx.moveTo(this.left, this.bottom);
		ctx.lineTo(this.left + this.width/2, this.top);
		ctx.lineTo(this.right, this.bottom);
		ctx.fill();
		ctx.stroke();
	}
};

// A tree background scenery object with getLeft, getRight, getTop, getBottom, and draw methods:
function Tree(x, y, trunkHeight, trunkWidth, leafWidth) {
	this.trunkHeight = trunkHeight;
	this.trunkWidth = trunkWidth;
	this.leafWidth = leafWidth;
	
	this.left = x;
	this.right = x + this.leafWidth;
	this.top = y - (this.trunkHeight + this.leafWidth/2);
	this.bottom = y;
	this.centerX = x + this.leafWidth/2;
	this.trunkLeft = this.centerX - this.trunkWidth/2;
	this.trunkRight = this.centerX + this.trunkWidth/2;
}
Tree.prototype = {
	getLeft: function() {
		return this.left;
	},

	getRight: function() {
		return this.right;
	},
	
	getTop: function() {
		return this.top;
	},

	getBottom: function() {
		return this.bottom;
	},

	draw: function(ctx) {
		ctx.fillStyle = TRUNK_COLOR;
		ctx.fillRect(this.trunkLeft, this.bottom, this.trunkWidth, -this.trunkHeight);
		ctx.fillStyle = LEAF_COLOR;
		ctx.beginPath();
		ctx.arc(this.centerX, this.bottom - this.trunkHeight, this.leafWidth/2, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.stroke();
	}
};

// A lake background scenery object with getLeft, getRight, getTop, getBottom, and draw methods:
function Lake(x, y, size) {
	this.size = size;
	this.left = x;
	this.right = x + this.size;
	this.top = y - this.size;
	this.bottom = y;
}
Lake.prototype = {
	getLeft: function() {
		return this.left;
	},

	getRight: function() {
		return this.right;
	},
	
	getTop: function() {
		return this.top;
	},

	getBottom: function() {
		return this.bottom;
	},
	
	draw: function(ctx) {
		ctx.fillStyle = WATER_COLOR;
		ctx.beginPath();
		ctx.arc(this.left + this.size/2, this.top + this.size/2, this.size/2, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.stroke();
	}
}

// Player Object
function ConstrPlayer(filename, x, y) {
	this.x = x;
	this.y = y;
	this.width = 64;
	this.height = 64;
	this.init(filename);
}
// Player Prototype
ConstrPlayer.prototype = {
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
			ctx.drawImage(this.img, this.x, this.y);
		}
	},

	move: function(dx, dy) {
		this.x += dx;
		this.y += dy;
		// Key point right here: the move() method of the player object - and no other
		// object -- tells TheWorld to scroll to keep the camera on the player.
		TheWorld.scrollIfNeeded(this);
	}
};

// The World
var TheWorld = {
	xOffset: 0,  // how far to the right has the view scrolled from its starting location
	yOffset: 0,
	canvasWidth: 600,
	canvasHeight: 400,
	leftScrollMargin: 200, // if you go left of 200 pixels the screen scrolls left
	rightScrollMargin: 400,  // if you go right of 400 pixels the screen scrolls right
	topScrollMargin: 133, // if you go up of 150 pixels the screen scrolls up
	bottomScrollMargin: 266,  // if you go down of 150 pixels the screen scrolls down

	// keep a list of background objects and a list of foreground objects --
	// all of these will get drawn 
	backgroundObjects: [],
	foregroundObjects: [],

	addBackgroundObject: function(obj) {
		this.backgroundObjects.push(obj);
	},

	addForegroundObject: function(obj) {
		this.foregroundObjects.push(obj);
	},

	worldXToScreenX: function(worldX) {
		return worldX - this.xOffset;
	},
	
	worldYToScreenY: function(worldY) {
		return worldY - this.yOffset;
	},

	scrollIfNeeded: function(player) {
		// get screen coordinates of player's four edges
		var screenLeft = this.worldXToScreenX(player.getLeft());
		var screenRight = this.worldXToScreenX(player.getRight());
		var screenTop = this.worldYToScreenY(player.getTop());
		var screenBottom = this.worldYToScreenY(player.getBottom());

		// if player's left is left of left scroll margin, scroll left
		if (screenLeft < this.leftScrollMargin) {
			// scroll by just enough to get player's left lined up with left scroll margin
			this.xOffset -= this.leftScrollMargin - screenLeft;
		}
		// if player's right is right of right scroll margin, scroll right
		if (player.getRight() - this.xOffset > this.rightScrollMargin) {
			// scroll by just enough to get player's right lined up with right scroll margin
			this.xOffset += screenRight - this.rightScrollMargin;
		}
		// if player's top is up of top scroll margin, scroll up
		if (screenTop < this.topScrollMargin) {
			// scroll by just enough to get player's top lined up with top scroll margin
			this.yOffset -= this.topScrollMargin - screenTop;
		}
		// if player's bottom is down of bottom scroll margin, scroll down
		if (player.getBottom() - this.yOffset > this.bottomScrollMargin) {
			// scroll by just enough to get player's bottom lined up with bottom scroll margin
			this.yOffset += screenBottom - this.bottomScrollMargin;
		}
	},

	drawIfOnScreen: function(obj, ctx) {
		// save time: don't bother drawing things that are off the screen.  This calls the
		// given object's draw() method if it's on screen, or does nothing if it's not.
		if (this.worldXToScreenX(obj.getRight()) < 0) {
			return;
		}
		if (this.worldXToScreenX(obj.getLeft()) > this.canvasWidth) {
			return;
		}
		if (this.worldYToScreenY(obj.getBottom()) < 0) {
			return;
		}
		if (this.worldYToScreenY(obj.getTop()) > this.canvasHeight) {
			return;
		}
		obj.draw(ctx);
	},
  
	draw: function(ctx) {
		// ground
		ctx.fillStyle = GROUND_COLOR;
		ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Now apply the translate transform to scroll the world
		ctx.save();
		ctx.translate(0 - this.xOffset, 0 - this.yOffset); 
		
		// draw all background objects in their scrolled location
		var i, obj;
		for (i=0; i<this.backgroundObjects.length; i++) {
			this.drawIfOnScreen(this.backgroundObjects[i], ctx);
		}
		
		// Draw foreground objects after background objects so they appear in front
		for (i=0; i<this.foregroundObjects.length; i++) {
			this.drawIfOnScreen(this.foregroundObjects[i], ctx);
		}
		ctx.restore();
	}
};

$(document).ready(function() {
	var context = $("#game_canvas")[0].getContext("2d");
	var player = new ConstrPlayer("images/LinkFront.gif", 200, 200);

	// Put the player in the world:
	TheWorld.addForegroundObject(player);
	
	// Make some background objects:
	TheWorld.addBackgroundObject(new Mountain(0, -550, 100, 120));
	TheWorld.addBackgroundObject(new Mountain(-30, -550, 90, 100));
	TheWorld.addBackgroundObject(new Mountain(20, -550, 120, 150));
	TheWorld.addBackgroundObject(new Mountain(-150, -400, 80, 100));
	TheWorld.addBackgroundObject(new Mountain(-100, -400, 100, 100));
	TheWorld.addBackgroundObject(new Mountain(100, -350, 80, 100));
	TheWorld.addBackgroundObject(new Mountain(150, -350, 100, 100));
	TheWorld.addBackgroundObject(new Mountain(300, -500, 80, 100));
	TheWorld.addBackgroundObject(new Mountain(350, -500, 100, 100));
	
	TheWorld.addBackgroundObject(new Mountain(900, 0, 80, 100));
	TheWorld.addBackgroundObject(new Mountain(950, 0, 100, 100));
	TheWorld.addBackgroundObject(new Mountain(700, 150, 80, 100));
	TheWorld.addBackgroundObject(new Mountain(750, 150, 100, 100));

	TheWorld.addBackgroundObject(new Tree(-40, 10, 70, 15, 50));
	TheWorld.addBackgroundObject(new Tree(10, -30, 70, 15, 55));
	TheWorld.addBackgroundObject(new Tree(100, 0, 70, 12, 45));
	TheWorld.addBackgroundObject(new Tree(140, 40, 70, 10, 40));
	TheWorld.addBackgroundObject(new Tree(200, -50, 70, 17, 60));
	
	TheWorld.addBackgroundObject(new Lake(100, 600, 100));

	TheWorld.draw(context);

	// Keydown sets Timer
	$(document).bind("keydown", function(e) {
		switch(e.which) {
			case LEFT_ARROW:
				clearInterval(left);
				left = setInterval(function() {
					player.move(-3, 0);
					TheWorld.draw(context);
				}, 3);
			break;

			case UP_ARROW:
				clearInterval(up);
				up = setInterval(function() {
					player.move(0, -3);
					TheWorld.draw(context);
				}, 3);
			break;

			case RIGHT_ARROW:
				clearInterval(right);
				right = setInterval(function() {
					player.move(3, 0);
					TheWorld.draw(context);
				}, 3);
			break;

			case DOWN_ARROW:
				clearInterval(down);
				down = setInterval(function() {
					player.move(0, 3);
					TheWorld.draw(context);
				}, 3);
			break;
		}
	});

	// Keyup clears Timer
	$(document).bind("keyup", function(e) {
		switch(e.which) {
			case LEFT_ARROW:
				clearInterval(left);
			break;

			case UP_ARROW:
				clearInterval(up);
			break;

			case RIGHT_ARROW:
				clearInterval(right);
			break;

			case DOWN_ARROW:
				clearInterval(down);
			break;
		}
	});
});