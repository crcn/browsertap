#ifndef WRTC_OBSERVERS_H_
#define WRTC_OBSERVERS_H_

#include "./core.h"

namespace wrtc {

  /**
   */

  class PeerConnectionObserver :
    public webrtc::PeerConnectionObserver,
    public rtc::RefCountInterface,
    public sigslot::has_slots<>
  {
   public:
    PeerConnectionObserver();

    void OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) final;
    void OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) final;
    void OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) final;
    void OnStateChange(webrtc::PeerConnectionObserver::StateType state) final;
    void OnIceCandidate(const webrtc::IceCandidateInterface* candidate) final;
    void OnDataChannel(webrtc::DataChannelInterface* channel) final;
    void OnRenegotiationNeeded() final;

    void OnAddStream(webrtc::MediaStreamInterface* stream) final;
    void OnRemoveStream(webrtc::MediaStreamInterface* stream) final;

    sigslot::signal1<const webrtc::IceCandidateInterface*> onIceCandidate;
    sigslot::signal1<webrtc::PeerConnectionInterface::IceGatheringState> onIceGatheringChange;
  };

  /**
   */

  class OfferObserver : public webrtc::CreateSessionDescriptionObserver {

   public:
    OfferObserver();
    virtual void OnSuccess(webrtc::SessionDescriptionInterface* sdp) final;
    virtual void OnFailure(const std::string &error) final;

    sigslot::signal1<webrtc::SessionDescriptionInterface*> onSuccess;
    sigslot::signal1<std::string> onFailure;
  };

  /**
   */

  class LocalDescriptionObserver : public webrtc::SetSessionDescriptionObserver {

   public:
    LocalDescriptionObserver();
    virtual void OnSuccess() final;
    virtual void OnFailure(const std::string &error) final;

    sigslot::signal0<> onSuccess;
    sigslot::signal1<std::string> onFailure;
  };

  /**
   */

  class DataChannelObserver : 
    public webrtc::DataChannelObserver, 
    public rtc::RefCountInterface
  {
   public:
    DataChannelObserver();
    sigslot::signal0<> onStateChange;
    sigslot::signal1<const webrtc::DataBuffer&> onMessage;

    void OnStateChange() final;
    void OnMessage(const webrtc::DataBuffer& buffer) final;
  };
}

#endif