#include "./observers.h"

namespace wrtc {

  /**
   */

  PeerConnectionObserver::PeerConnectionObserver() { }

  void PeerConnectionObserver::OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) {
    LOG_VERBOSE("PeerConnectionObserver::OnSignalingChange");
  }

  void PeerConnectionObserver::OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) {
    LOG_VERBOSE("PeerConnectionObserver::OnIceConnectionChange");
  }

  void PeerConnectionObserver::OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    LOG_VERBOSE("PeerConnectionObserver::OnIceGatheringChange");
    onIceGatheringChange.emit(state);
  }

  void PeerConnectionObserver::OnStateChange(webrtc::PeerConnectionObserver::StateType state) {
    LOG_VERBOSE("PeerConnectionObserver::OnStateChange");
  }

  void PeerConnectionObserver::OnIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    LOG_VERBOSE("PeerConnectionObserver::onIceCandidate");
    onIceCandidate.emit(candidate);
  }

  void PeerConnectionObserver::OnDataChannel(webrtc::DataChannelInterface* channel) {
    LOG_VERBOSE("PeerConnectionObserver::OnDataChannel");
  }

  void PeerConnectionObserver::OnRenegotiationNeeded() {
    LOG_VERBOSE("PeerConnectionObserver::OnRenegotiationNeeded");
  }

  void PeerConnectionObserver::OnAddStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE("PeerConnectionObserver::OnAddStream");
  }

  void PeerConnectionObserver::OnRemoveStream(webrtc::MediaStreamInterface* stream) {
    LOG_VERBOSE("PeerConnectionObserver::OnRemoveStream");
  }

  /**
   */

  OfferObserver::OfferObserver(){ }

  void OfferObserver::OnSuccess(webrtc::SessionDescriptionInterface* sdp) {
    LOG_VERBOSE("OfferObserver::OnSuccess");
    onSuccess.emit(sdp);
  }

  void OfferObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE("OfferObserver::OnFailure");
    onFailure.emit(error);
  }

  LocalDescriptionObserver::LocalDescriptionObserver() { }


  void LocalDescriptionObserver::OnSuccess() {
    LOG_VERBOSE("LocalDescriptionObserver::OnSuccess");
    onSuccess.emit();
  }

  void LocalDescriptionObserver::OnFailure(const std::string &error) {
    LOG_VERBOSE("LocalDescriptionObserver::OnFailure");
    onFailure.emit(error);
  }

  DataChannelObserver::DataChannelObserver() { }

  void DataChannelObserver::OnStateChange() {
    LOG_VERBOSE("DataChannelObserver::OnStateChange");
    onStateChange.emit();
  };

  void DataChannelObserver::OnMessage(const webrtc::DataBuffer& buffer) {
    LOG_VERBOSE("DataChannelObserver::OnMessage");
    onMessage.emit(buffer);
  }
}