/**
the remote desktop server needs to be interoperable with other platforms. Just a few ideas to make that happen. Ideally
there'd be a common interface so that this sort of thing could be used in JS as well. Also noting the fact that this sort
of arch would eventually be moved into display drivers
*/

class HardwareEvent {
}

class MouseEvent extends HardwareEvent {
    type: "mousedown"
    x: 100
    y: 100
}

class KeyboardEvent extends HardwareEvent {
    type: "mouse"
    keyCode: 42
}

class Screen {
    id: 0
    x: 100
    y: 100
    width: 100
    height: 100
    ByteArray print()
}

class MacAdapter {
    public MacAdapter() {
    }
    public function get vector<Screens> screens() {

    }
    public dispatchHardwareEvent(event:HardwareEvent) {

    }
};


MacAdapter ma        = new MacAdapter();
RemoteAdapter ra     = new RemoteAdapter();

projector.addEventListener("event", function(event) {
    ma.dispatchHardwareEvent(event);
});

int ticks = 0;
int ms    = 30/60;

// TODO - do this:

/*

Window win = ra.createWindow();
win.update(screen.print(), screen.x, screen.y, screen.width, screen.height);

win.close();
*/

while (1) {

    if (!screen.inFocus && !(++ticks % 20)) continue;

    // TODO - do some diffing here on screens
    for (var screen in ma.screens) {
        ra.project(screen.print(), screen.x, screen.y, screen.width, screen.height);
    }

    sleep(fps);
}
