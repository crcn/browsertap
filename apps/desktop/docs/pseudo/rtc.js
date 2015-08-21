function RemoteWindow(signal) {

}

function RemoteDesktop(remoteObserver) {
  remoteObserver->signalDisplayWindow->connect(this, onDisplayWindow);
}

extend(RemoteDesktop.prototype, {
  onDisplayWindow()
});