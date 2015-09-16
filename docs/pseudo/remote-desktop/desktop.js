var provisioner = new GroupProvisioner(
  new AWS(),
  new LocalVMS(new VirtualBox(path))
);

var server = sift({ name: "windows", version: "10", arch: "x64" }, yield aws.getServers());

// start & wait until booted
yield server.start();

// setup the new desktop
var desktop = new Desktop(server);



