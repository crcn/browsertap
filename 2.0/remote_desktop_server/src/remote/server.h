#ifndef _REMOTE_SERVER_
#define _REMOTE_SERVER_

#include "../base/desktop.h"
#include "talk/app/webrtc/videosourceinterface.h"
#include "talk/app/webrtc/peerconnectionfactoryproxy.h"
#include "talk/app/webrtc/proxy.h"

#include "webrtc/base/logging.h"
#include "webrtc/base/json.h"
#include "webrtc/base/sigslot.h"
#include "webrtc/base/basictypes.h"
#include "webrtc/base/common.h"
#include "webrtc/base/scoped_ptr.h"
#include "webrtc/base/ssladapter.h"
#include "webrtc/base/sslstreamadapter.h"
#include "webrtc/base/stringutils.h"
#include "webrtc/base/thread.h"
#include "webrtc/base/buffer.h"
#include "webrtc/base/scoped_ref_ptr.h"
#include "webrtc/base/refcount.h"

#include "talk/app/webrtc/jsep.h"
#include "talk/app/webrtc/jsepsessiondescription.h"
#include "talk/app/webrtc/mediaconstraintsinterface.h"
#include "talk/app/webrtc/mediastreaminterface.h"
#include "talk/app/webrtc/peerconnectionfactory.h"
#include "talk/app/webrtc/peerconnectioninterface.h"
#include "talk/app/webrtc/test/fakeconstraints.h"
#include "talk/app/webrtc/datachannelinterface.h"
#include "talk/app/webrtc/videosourceinterface.h"
#include "talk/app/webrtc/videosource.h"

#include "talk/media/base/videocapturerfactory.h"
#include "talk/media/base/videocapturer.h"
#include "talk/media/sctp/sctpdataengine.h"
#include "talk/media/devices/devicemanager.h"
#include "talk/media/webrtc/webrtcvideocapturerfactory.h"
#include "./peer.h"
#include "./core.h"
#include <stdio.h>

namespace remote {

  class Server;

  /**
   */

  class PeerConnectionObserver : 
    public webrtc::PeerConnectionObserver, 
    public rtc::RefCountInterface 
  {
   public:
    PeerConnectionObserver(Server* _server);

    void OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) final;
    void OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) final;
    void OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) final;
    void OnStateChange(webrtc::PeerConnectionObserver::StateType state) final;
    void OnIceCandidate(const webrtc::IceCandidateInterface* candidate) final;
    void OnDataChannel(webrtc::DataChannelInterface* channel) final;
    void OnRenegotiationNeeded() final;

    void OnAddStream(webrtc::MediaStreamInterface* stream) final;
    void OnRemoveStream(webrtc::MediaStreamInterface* stream) final;


   private:
    Server* _server;
  };

  /**
   */

  class OfferObserver : public webrtc::CreateSessionDescriptionObserver {    
   
   public:
    OfferObserver(Server *_server);
    virtual void OnSuccess(webrtc::SessionDescriptionInterface* sdp) final;
    virtual void OnFailure(const std::string &error) final;
    
    sigslot::signal1<webrtc::SessionDescriptionInterface*> onSuccess;
    sigslot::signal1<std::string> onFailure;
   private:
    Server* _server;
  };

  /**
   */

  class LocalDescriptionObserver : public webrtc::SetSessionDescriptionObserver {    
   
   public:
    LocalDescriptionObserver(Server *_server);
    virtual void OnSuccess() final;
    virtual void OnFailure(const std::string &error) final;

    sigslot::signal0<> onSuccess;
    sigslot::signal1<std::string> onFailure;
    
   private:
    Server* _server;
  };

  /**
   */

  class Server : public sigslot::has_slots<>, public rtc::Runnable {
    friend class OfferObserver;
    friend class PeerConnectionObserver;
    friend class LocalDescriptionObserver;

  public:
    Server(base::Desktop* desktop);
    ~Server();
    void Run(rtc::Thread* thread);
    void connect(std::string server, const unsigned short port);

  private:
    base::Desktop* _desktop;
    rtc::Thread* _signalThread;
    Peer* _peer;
    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> _connection;

    /**
     * observers
     */

    rtc::scoped_refptr<PeerConnectionObserver> _peerConnectionObserver;
    rtc::scoped_refptr<OfferObserver> _offerObserver;
    rtc::scoped_refptr<LocalDescriptionObserver> _localDescriptionObserver;
    rtc::scoped_refptr<webrtc::DataChannelInterface> _dataChannel;

    void _createThreads();
    void _createPeerFactory();
    void _createObservers();
    void _createDataChannels();
    void _createOffers();
    void _onOfferSuccess(webrtc::SessionDescriptionInterface* sdp);
    void _onLocalDescriptionSuccuess();
    webrtc::PeerConnectionInterface::IceServers _iceServers();
  };


};

#endif