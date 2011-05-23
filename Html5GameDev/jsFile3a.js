const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SKY_COLOR = "rgb(100, 180, 240)";
const GROUND_COLOR = "rgb(150, 140, 110)";
const TRUNK_COLOR = "rgb(100, 100, 50)";
const LEAF_COLOR = "rgba(0, 200, 0, 0.8)";

function Constructobot(filename, x, y) {
  this.x = x;
  this.y = y;
  this.width = 64;
  this.height = 64;
  this.init(filename);
}
Constructobot.prototype = {
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
      ctx.drawImage(this.img, this.x, this.y - this.height);
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

var TheWorld = {
  xOffset: 0,  // how far to the right has the view scrolled from its starting location
  groundLevel: 264, 
  canvasWidth: 600,
  canvasHeight: 400,
  leftScrollMargin: 200, // if you go left of 200 pixels the screen scrolls left
  rightScrollMargin: 400,  // if you go right of 400 pixels the screen scrolls right

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

  scrollIfNeeded: function(player) {
    // get screen coordinates of player's left and right edges
    var screenLeft = this.worldXToScreenX(player.getLeft());
    var screenRight = this.worldXToScreenX(player.getRight());

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
  },

  drawIfOnScreen: function(obj, ctx) {
    // save time: don't bother drawing things that are off the screen.  This calls the
    // given object's draw() method if it's on screen, or does nothing if it's not.
    if (this.worldXToScreenX(obj.getRight()) < 0 ) {
      return;
    }
    if (this.worldXToScreenX(obj.getLeft()) > this.canvasWidth ) {
      return;
    }
    obj.draw(ctx);
  },
  
  draw: function(ctx) {
    // blue sky
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, this.canvasWidth, this.groundLevel);

    // ground
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, this.groundLevel, this.canvasWidth, this.canvasHeight - this.groundLevel);

    // horizon
    ctx.strokeStyle = "black";
    ctx.strokeWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.groundLevel);
    ctx.lineTo(this.canvasWidth, this.groundLevel);
    ctx.stroke();

    // Now apply the translate transform to scroll the world
    ctx.save();   
    ctx.translate( 0 - this.xOffset, this.groundLevel); 
    // draw all background objects in their scrolled location
    var i, obj;
    for (i = 0; i < this.backgroundObjects.length; i++) {
      this.drawIfOnScreen(this.backgroundObjects[i], ctx);
    }
    // Draw foreground objects after background objects so they
    // appear in front
    for (i = 0; i < this.foregroundObjects.length; i++) {
      this.drawIfOnScreen(this.foregroundObjects[i], ctx);
    }
    ctx.restore();
  }
};

// A random background scenery object with getLeft, getRight, and draw methods:
function Mountain(x, size) {
  this.left = x;
  this.size = size;
  this.right = this.left + this.size * 2;
}
Mountain.prototype = {
  getLeft: function() {
    return this.left;
  },

  getRight: function() {
    return this.right;
  },

  draw: function(ctx) {
    ctx.fillStyle = GROUND_COLOR;
    ctx.beginPath();
    ctx.moveTo(this.left, 0);
    ctx.lineTo(this.left + this.size, 0 - this.size);
    ctx.lineTo(this.right, 0);
    ctx.fill();
    ctx.stroke();
  }
};

// A random background scenery object with getLeft, getRight, and draw methods:
function Tree(x, trunkHeight, leafWidth) {
  this.left = x;
  this.leafWidth = leafWidth;
  this.right = this.left + this.leafWidth * 2;
  this.center = this.left + this.leafWidth;
  this.trunkLeft = this.center - 10;
  this.trunkRight = this.center + 10;
  this.trunkHeight = trunkHeight;
  this.trunkWidth = 20;
}
Tree.prototype = {
  getLeft: function() {
    return this.left;
  },

  getRight: function() {
    return this.right;
  },

  draw: function(ctx) {
    ctx.fillStyle = TRUNK_COLOR;
    ctx.fillRect(this.trunkLeft, 0 - this.trunkHeight, this.trunkWidth, this.trunkHeight);
    ctx.fillStyle = LEAF_COLOR;
    ctx.beginPath();
    ctx.arc(this.center, 0 - this.trunkHeight, this.leafWidth, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
  }
};

$(document).ready(function() {
  var context = $("#game-canvas")[0].getContext("2d");

  var bot = new Constructobot("constructobot.png", 200, 0);

  // Put the bot in the world:
  TheWorld.addForegroundObject(bot);

  // Make some background objects:
  TheWorld.addBackgroundObject(new Tree(100, 60, 30));
  TheWorld.addBackgroundObject(new Tree(180, 80, 30));
  TheWorld.addBackgroundObject(new Tree(260, 60, 30));
  TheWorld.addBackgroundObject(new Mountain(400, 150));
  TheWorld.addBackgroundObject(new Mountain(600, 200));
  TheWorld.addBackgroundObject(new Tree(1200, 80, 40));
  TheWorld.addBackgroundObject(new Tree(1300, 40, 20));


  TheWorld.draw(context);


  $(document).bind("keydown", function(evt) {
    if (evt.which == LEFT_ARROW) {
      bot.move(-10, 0);
      TheWorld.draw(context);
    }
    if (evt.which == RIGHT_ARROW) {
      bot.move(10, 0);
      TheWorld.draw(context);
    }
  });
});