// @Description: Move an image around the screen with the mouse
// @Autor: Santiago Balladares
// @Date: 01/05/2011 23:00

//document.defaultAction = false;

$(document).ready(function() {
	var tank = $("#tank");
	
	tank.css({
		"position" : "relative",
	});
	
	var position = tank.offset();

	var x = position.top;
	var y = position.left;

	var rightEdge = $(window).width() - tank.width();
	var bottomEdge = $(window).height() - tank.height();

	$(document).mousemove(function(e) {
		tank.stop();
		x = e.pageX - tank.width()/2 + "px";
		y = e.pageY - tank.height()/2 + "px";

		tank.animate({
			"top" : y,
			"left" : x
		}, 50, 'linear');
	});
});