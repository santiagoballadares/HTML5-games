// @Description: Move an image around the screen with the arrow keys
// @Autor: Santiago Balladares
// @Date: 01/05/2011 23:00

document.defaultAction = false;
document.onkeydown = detectEvent;

function detectEvent(e) {
	var evt = e || window.event;
	var unicode;
	unicode = evt.keyCode? evt.keyCode : evt.charCode;
	changePosition(unicode);
	return document.defaultAction;	
}

function changePosition(unicode) {
	var tank = $("#tank");
	var position = tank.offset();
	var x = position.left;
	var y = position.top;
	var rightEdge = $(window).width() - tank.width();
	var bottomEdge = $(window).height() - tank.height();

	switch(unicode) {
		case 37:
			//left arrow
			(x > 5) ? x -= 5 : x = 0;
			$("#tank").css("left", x + "px");
			break;
		case 38:
			//up arrow
			(y > 5) ? y -= 5 : y = 0;
			$("#tank").css("top", y + "px");
			break;
		case 39:
			//right arrow
			(x < rightEdge - 5) ? x += 5 : x = rightEdge;
			$("#tank").css("left", x + "px");
			break;
		case 40:
			//down arrow
			(y < bottomEdge - 5) ? y += 5 : y = bottomEdge;
			$("#tank").css("top", y + "px");
			break;
		default:
			//do nothing
			break;
	}
}