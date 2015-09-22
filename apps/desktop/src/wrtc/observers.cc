#include "./observers.h"

namespace wrtc {

  /**
   */

  PeerConnectionObserver::PeerConnectionObserver() { }

  void PeerConnectionObserver::OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnSignalingChange");
  }

  void PeerConnectionObserver::OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnIceConnectionChange");
  }

  void PeerConnectionObserver::OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnIceGatheringChange");
    onIceGatheringChange.emit(state);
  }

  void PeerConnectionObserver::OnStateChange(webrtc::PeerConnectionObserver::StateType state) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnStateChange");
  }

  void PeerConnectionObserver::OnIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::onIceCandidate");
    onIceCandidate.emit(candidate);
  }

  void PeerConnectionObserver::OnDataChannel(webrtc::DataChannelInterface* channel) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnDataChannel");
  }

  void PeerConnectionObserver::OnRenegotiationNeeded() {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnRenegotiationNeeded");
  }

  void PeerConnectionObserver::OnAddStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnAddStream");
  }

  void PeerConnectionObserver::OnRemoveStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE("wrtc::PeerConnectionObserver::OnRemoveStream");
  }

  /**
   */

  OfferObserver::OfferObserver(){ }

  void OfferObserver::OnSuccess(webrtc::SessionDescriptionInterface* sdp) {
    LOG_VERBOSE("wrtc::OfferObserver::OnSuccess");
    onSuccess.emit(sdp);
  }

  void OfferObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE("wrtc::OfferObserver::OnFailure");
    onFailure.emit(error);
  }

  LocalDescriptionObserver::LocalDescriptionObserver() { }


  void LocalDescriptionObserver::OnSuccess() {
    LOG_VERBOSE("wrtc::LocalDescriptionObserver::OnSuccess");
    onSuccess.emit();
  }

  void LocalDescriptionObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE("wrtc::LocalDescriptionObserver::OnFailure");
    onFailure.emit(error);
  }

  DataChannelObserver::DataChannelObserver() { }

  void DataChannelObserver::OnStateChange() {
    LOG_VERBOSE("wrtc::DataChannelObserver::OnStateChange");
    onStateChange.emit();
  };

  void DataChannelObserver::OnMessage(const webrtc::DataBuffer& buffer) {
    LOG_VERBOSE("wrtc::DataChannelObserver::OnMessage");
    onMessage.emit(buffer);
  }
}