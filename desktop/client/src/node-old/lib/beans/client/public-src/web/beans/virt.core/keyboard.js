var remote;
var vk = {
	VK_NUMLOCK: 0x67,
	VK_NUMPAD8: 0x68,
	VK_TAB: 0x09,
	VK_RETURN: 0x0D,
	VK_LEFT: 0x025,
	VK_UP: 0x26,
	VK_RIGHT: 0x27,
	VK_ALT: 0x80,
	VK_DOWN: 0x28,
	VK_LSHIFT: 0xA0,
	VK_RSHIFT: 0xA1,
	VK_CONTROL: 0x11,
	VK_SHIFT: 0x10,
	VK_BACK: 0x08,
	VK_ESCAPE: 0x1B
};
var keyboardEvents = {
	KEYEVENTF_EXTENDEDKEY: 0x0001,
	KEYEVENTF_KEYUP: 0x0002
};


exports.init = function(rm) {
	remote = rm;
}


function keyboardEvent(key, modifiers, dwFlags) {
	if(!remote) return;

	remote.bridge.keyboardEvent({ key: key, modifiers: modifiers || 0, dwFlags: dwFlags || 0 });
}

function modifierEvent(key) {
	keyboardEvent(key, 0, keyboardEvents.KEYEVENTF_EXTENDEDKEY | keyboardEvents.KEYEVENTF_KEYUP);
}


var onKey = function(e, dw)
{
	keyboardEvent(e.keyCode, 0, dw);
}

var modifiersDown = { altKey: false, shiftKey: false, ctrlKey: false };
var modifiers = { altKey: 0, shiftKey: 16, ctrlKey: 17 };

var onModifiers = function(e, dwFlags)
{

	for(var key in modifiersDown) {


		if(modifiersDown[key] != e[key]) {
			modifiersDown[key] = e[key];
			onKey({ keyCode: modifiers[key] }, e[key] ? 0 : keyboardEvents.KEYEVENTF_KEYUP);
		}
	}
}

var onKeyDown = function(e)
{ 
	console.log(e);
	//onModifiers(e);
	onKey(e, 0);
}

var onKeyUp = function(e)
{
	// onKey(e, 0);
	//onModifiers(e);
	onKey(e, keyboardEvents.KEYEVENTF_KEYUP);
}


_.extend(window.desktopEvents, {
	keyDown: onKeyDown,
	keyUp: onKeyUp
});

