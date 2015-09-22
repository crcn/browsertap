#ifndef WRTC_OBSERVERS_H_
#define WRTC_OBSERVERS_H_

#include "./core.h"

namespace wrtc {

  class Connection;

  /**
   */

  class PeerConnectionObserver :
    public webrtc::PeerConnectionObserver,
    public rtc::RefCountInterface,
    public sigslot::has_slots<>
  {
   public:
    PeerConnectionObserver(Connection* _server);

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

   private:
    Connection* _connection;
  };

  /**
   */

  class OfferObserver : public webrtc::CreateSessionDescriptionObserver {

   public:
    OfferObserver(Connection* _connection);
    virtual void OnSuccess(webrtc::SessionDescriptionInterface* sdp) final;
    virtual void OnFailure(const std::string &error) final;

    sigslot::signal1<webrtc::SessionDescriptionInterface*> onSuccess;
    sigslot::signal1<std::string> onFailure;
   private:
    Connection* _connection;
  };

  /**
   */

  class LocalDescriptionObserver : public webrtc::SetSessionDescriptionObserver {

   public:
    LocalDescriptionObserver(Connection* _connection);
    virtual void OnSuccess() final;
    virtual void OnFailure(const std::string &error) final;

    sigslot::signal0<> onSuccess;
    sigslot::signal1<std::string> onFailure;

   private:
    Connection* _connection;
  };
}

#endif