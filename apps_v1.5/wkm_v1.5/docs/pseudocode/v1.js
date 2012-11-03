
//controls all the windows
var WindowManager = requrie("./windowManager"),

//ffmpeg window recorder
WindowRecorder    = require("./windowRecorder"),

//remote controller transport
RemoteController  = require("./remoteController"),

//transport for CLI
CLITransport      = require("./remoteController/cliTransport") //udpController



//first fetch ALL the windows on the desktop which are open
// var windows = WindowManager.getWindows(WindowManager.VISIBLE | WindowManager.MOVEABLE),

//first initialize the CLI transport. Windows is needed so the controller can keep track of the windows, 
//and dispatch an event if any open, close, etc.
controller = new RemoteController(new CLITransport(), WindowManager, new WindowRecorder());


//start the controller
controller.listen();

//----------------------
//CONTROLLER JS
//----------------------

//THIS = remoteController
var windowController = new WindowController(this, WindowManager.VISIBLE | WindowManager.MOVEABLE);
	//ALSO contains mouseController, and keyboardController for EACH window that's registered
	//events include:
	//dispatch windowOpen
	//listen window [hwnd] [action (broadcast|close)]
	//listen mouseMove [hwnd] [x] [y]

//EventManager takes in a event target
var eventManager     = new EventManager(transport);
eventManager.register(windowController);

//run forever, taking in events
while(transport.isOpen()) {
	transport.run();
}



//----------------------
//WINDOWRECORDER JS
//----------------------


windowRecorder
