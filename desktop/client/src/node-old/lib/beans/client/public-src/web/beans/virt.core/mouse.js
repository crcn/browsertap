var remote;


exports.init = function(rm) {
	remote = rm;
}
var mouseCoords = {
	x: 0,
	y: 0
}

var mouseEvents = {
	MOUSEEVENTF_ABSOLUTE: 0x8000,
	MOUSEEVENTF_LEFTDOWN: 0x0002,
	MOUSEEVENTF_LEFTUP: 0x0004,
	MOUSEEVENTF_MIDDLEDOWN: 0x0020,
	MOUSEEVENTF_MIDDLEUP: 0x0040,
	MOUSEEVENTF_MOVE: 0x0001,
	MOUSEEVENTF_RIGHTDOWN: 0x0008,
	MOUSEEVENTF_RIGHTUP: 0x0010,
	MOUSEEVENTF_WHEEL: 0x0800,
	MOUSEEVENTF_XDOWN: 0x0080,
	MOUSEEVENTF_XUP: 0x100
};


function mouseEvent(code, data) {

	if(!remote) return;
	remote.bridge.mouseEvent({ code: code, x: mouseCoords.x, y: mouseCoords.y, data: data });
}

		

var onMouseMove = _.throttle(function(e) {
	mouseCoords.x = e.x || e.pageX;
	mouseCoords.y = e.y || e.pageY;

	mouseEvent(mouseEvents.MOUSEEVENTF_ABSOLUTE);
}, 10);


var onMouseDown = function(e, bt)
{
	
	mouseEvent(bt.button == 0 ? mouseEvents.MOUSEEVENTF_LEFTDOWN : mouseEvents.MOUSEEVENTF_RIGHTDOWN);
}

var onMouseUp = function(e, bt)
{	
	mouseEvent(bt.button == 0 ? mouseEvents.MOUSEEVENTF_LEFTUP : mouseEvents.MOUSEEVENTF_RIGHTUP);
};

var onDoubleClick = function(e)
{
	//this should NOT be here.
	onClick(e);
	onClick(e);
}

var onClick = function(e)
{
	onMouseDown(e);
	onMouseUp(e);
}

var onScroll = _.throttle(function(e)
{
	mouseEvent(mouseEvents.MOUSEEVENTF_WHEEL, e.delta);
}, 50);


_.extend(window.desktopEvents, {
	mouseWheel: onScroll,
	mouseMove: onMouseMove,
	doubleClick: onDoubleClick
});


$(window).bind('desktopDown', onMouseDown);
$(window).bind('desktopUp', onMouseUp);
