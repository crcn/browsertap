/*
1. need to see available machines
2. need to see launchable applications
*/

var provisioner = new GroupProvisioner(
  new AWS(),
  new LocalVMS(new VirtualBox(path))
);

var server = sift({ action: "windows", version: "10", arch: "x64" }, yield aws.getServers());

// start & wait until booted
yield server.start();

// setup the new desktop
var desktop = new Desktop(server);

// signal webrtc launch
yield desktop.launch({ action: "chrome", version: "36", args: [] });

yield desktop.getScreens();

desktop.sendKeyboardEvent();
desktop.sendMouseEvent();
