// @Description: Detect keystrokes and displays a message.
//			   Displays an message for arrow keys and the key code for ther other keys.
//			   There is a checkbox which allows to prevent the browser default action for certain keystrokes.
// @Autor: Santiago Balladares
// @Date: 20/04/2011 16:00

window.onload = init;
document.defaultAction = true;

function init() {
	var x = document.getElementById('default');
	x.onclick = setDefault;
	if (x.checked) {
		x.onclick();
	}

	//The keypress event fires only in Firefox for the arrow keys
	//document.onkeypress = detectEvent;
	document.onkeydown = detectEvent;
	
	document.getElementById('emptyWriteroot').onclick = function () {
		document.getElementById('writeroot').innerHTML = '';
		return false;
	}
}

function setDefault() {
	document.defaultAction = !this.checked;
}

function detectEvent(e) {
	var evt = e || window.event;
	var unicode;
	unicode = evt.keyCode? evt.keyCode : evt.charCode;
	writeData(detectKey(unicode));
	//alert(unicode);
	return document.defaultAction;	
}

function detectKey(unicode) {
	var msg = ' ';
	switch(unicode) {
		case 37:
			msg = 'You pressed the left arrow.';
			break;
		case 38:
			msg = 'You pressed the up arrow.';
			break;
		case 39:
			msg = 'You pressed the right arrow.';
			break;
		case 40:
			msg = 'You pressed the down arrow.';
			break;
		default:
			msg = 'Key code: ' + unicode;
			break;
	}
	return msg;
}

function writeData(msg) {
	document.getElementById('writeroot').innerHTML += msg + '<br />';
}