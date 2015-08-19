#include "./observers.h"

rtc::PeerConnectionObserver::PeerConnectionObserver(core::EventEmitter* listener):
_listener(listener) {

}

void rtc::PeerConnectionObserver::OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) {
  _listener->emit(kPeerConnectionSignalChange);
}

void rtc::PeerConnectionObserver::OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) {
  _listener->emit(kPeerConnectionIceChange);
}

void rtc::PeerConnectionObserver::OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
  _listener->emit(kPeerConnectionIceGathering);
}

void rtc::PeerConnectionObserver::OnStateChange(webrtc::PeerConnectionObserver::StateType state) {
  // _listener->emit(kPeerConnectionStateChange);
}

void rtc::PeerConnectionObserver::OnIceCandidate(const webrtc::IceCandidateInterface* candidate) {
  _listener->emit(kPeerConnectionIceCandidate);
}

void rtc::PeerConnectionObserver::OnDataChannel(webrtc::DataChannelInterface* channel) {
  // _listener->emit(kPeerConnectionDataChannel);
}

void rtc::PeerConnectionObserver::OnRenegotiationNeeded() {
  _listener->emit(kPeerConnectionRenegotiation);
}

void rtc::PeerConnectionObserver::OnAddStream(webrtc::MediaStreamInterface* stream) {
  _listener->emit(kPeerConnectionAddStream);
}

void rtc::PeerConnectionObserver::OnRemoveStream(webrtc::MediaStreamInterface* stream) {
  _listener->emit(kPeerConnectionRemoveStream);
}
