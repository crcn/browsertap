#ifndef _RTC_PEER_CONNECTION_
#define _RTC_PEER_CONNECTION_

#include "./configuration.h"
#include "./observers.h"
#include "talk/app/webrtc/videosourceinterface.h"
#include "talk/app/webrtc/peerconnectionfactoryproxy.h"
#include "talk/app/webrtc/proxy.h"
#include "./media_constraints.h"
#include "../core/event_emitter.h"

namespace rtc {
  class PeerConnection : public core::EventEmitter {

  public:
    PeerConnection(Configuration config);
    void addStream(rtc::scoped_refptr<webrtc::MediaStreamInterface> mediaStream);

    // void createOffer();
    // void addStream();
    // void setRemoteSecription();
    // void createAnswer();
    // void setLocalDescription();
    // void updateIce();
    // void addIceCandidate();
    // void getConfiguration();
    // void getLocalStreams();
    // void getRemoteStreams();
    // void getStreamById();
    // void addStream()
    // void removeStream();
    // void close();
    // void createDataChannel();
    // void createDTMFSender();
    // void getStats();
    // void setIdentityProvider();
    // void getIdentityAssertion();
    // 

  private:
    Configuration _config;
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> _socket;
    rtc::scoped_refptr<MediaConstraints> _constraints;
    rtc::scoped_refptr<PeerConnectionObserver> _peer;
    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;
    webrtc::PeerConnectionInterface* socket();

  };
};

#endif