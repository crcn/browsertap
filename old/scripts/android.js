var exec = require("child_process").exec,
spawn = require("child_process").spawn,
path = require("path"),
url = process.argv.pop(),
avd = process.argv.pop(),
androidSDKPath = "~/Browsers/Android/sdk".replace("~", process.env.HOME || "C:\\" ),
emulatorBinPath = path.join(androidSDKPath, "tools/emulator.exe"),
adbBinPath = path.join(androidSDKPath, "platform-tools/adb.exe");

var emProc = spawn(emulatorBinPath, ["-avd", avd]);

emProc.stdout.on("data", function(chunk) {
	process.stdout.write(chunk);
});


emProc.stderr.on("data", function(chunk) {
	process.stderr.write(chunk);
});


function openUrl() {
	var proc = spawn(adbBinPath, ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url]);
	var error = false;
	proc.stderr.on("data", function(chunk) {
		process.stderr.write(chunk);
		error = error || !String(chunk).toLowerCase().indexOf("error");
	});

	proc.stdout.on("data", function(chunk) {
		process.stdout.write(chunk);
	});

	proc.on("exit", function(code) {
		if(error) setTimeout(openUrl, 1000);
	})
}

openUrl();