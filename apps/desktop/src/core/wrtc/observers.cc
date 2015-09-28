#include "./observers.h"

namespace wrtc {

  /**
   */

  PeerConnectionObserver::PeerConnectionObserver() { }

  void PeerConnectionObserver::OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PeerConnectionObserver::OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PeerConnectionObserver::OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onIceGatheringChange.emit(state);
  }

  void PeerConnectionObserver::OnStateChange(webrtc::PeerConnectionObserver::StateType state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onStateChange.emit(state);
  }

  void PeerConnectionObserver::OnIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onIceCandidate.emit(candidate);
  }

  void PeerConnectionObserver::OnDataChannel(webrtc::DataChannelInterface* channel) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PeerConnectionObserver::OnRenegotiationNeeded() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PeerConnectionObserver::OnAddStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PeerConnectionObserver::OnRemoveStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  /**
   */

  OfferObserver::OfferObserver(){ }

  void OfferObserver::OnSuccess(webrtc::SessionDescriptionInterface* sdp) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onSuccess.emit(sdp);
  }

  void OfferObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onFailure.emit(error);
  }

  LocalDescriptionObserver::LocalDescriptionObserver() { }

  void LocalDescriptionObserver::OnSuccess() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onSuccess.emit();
  }

  void LocalDescriptionObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onFailure.emit(error);
  }

  DataChannelObserver::DataChannelObserver() { }

  void DataChannelObserver::OnStateChange() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onStateChange.emit();
  };

  void DataChannelObserver::OnMessage(const webrtc::DataBuffer& buffer) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    onMessage.emit(buffer);
  }
}