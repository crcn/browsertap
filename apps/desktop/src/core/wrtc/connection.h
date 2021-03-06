#ifndef WRTC_CONNECTION_H_
#define WRTC_CONNECTION_H_

#include "./core.h"
#include "talk/app/webrtc/videosourceinterface.h"
#include "talk/app/webrtc/peerconnectionfactoryproxy.h"
#include "talk/app/webrtc/proxy.h"

#include "../graphics/printable.h"
#include "webrtc/base/logging.h"
#include "webrtc/base/json.h"
#include "webrtc/base/sigslot.h"
#include "webrtc/base/basictypes.h"
#include "webrtc/base/common.h"
#include "webrtc/base/scoped_ptr.h"
#include "webrtc/base/ssladapter.h"
#include "webrtc/base/sslstreamadapter.h"
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
#include "./observers.h"
#include "../events/event_emitter.h"
#include "../thread/mutex.h"
#include "../thread/condition.h"
#include "./session_description.h"
#include "./printable_video_capturer.h"
#include <json/json.h>

namespace wrtc {

  enum ConnectionEvent {
    WRTC_OFFER,
    DISCONNECTED
  };


  class Connection : public sigslot::has_slots<>, public core::EventEmitter {
  public:
    graphics::Printable* video;

    Connection(graphics::Printable* video);
    Connection();
    bool connected();
    void setRemoteDescription(SessionDescription description);
    SessionDescription* localDescription;

  private:
    bool _connected;
    void _disconnect();
    PrintableVideoCapturer* _capturer;
    rtc::scoped_refptr<PeerConnectionObserver> _peerConnectionObserver;
    rtc::scoped_refptr<OfferObserver> _offerObserver;
    rtc::scoped_refptr<LocalDescriptionObserver> _localDescriptionObserver;
    rtc::scoped_refptr<DataChannelObserver> _dataChannelObserver;

    webrtc::FakeConstraints _constraints;
    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> _connection;
    rtc::scoped_refptr<webrtc::DataChannelInterface> _dataChannel;

    Json::Value& getLocalOffer();
    void _onOfferSuccess(webrtc::SessionDescriptionInterface* sdp);
    void _onIceCandidate(const webrtc::IceCandidateInterface* candidate);
    void _onIceConnectionConnected();
    void _onStateChange(webrtc::PeerConnectionObserver::StateType);
    void _onDataChannelMessage(const webrtc::DataBuffer& buffer);
    void _onDataChannelStateChange();
    void _onIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state);
    void _onIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state);
    void _onLocalDescriptionSuccess();
    void _setVideo(graphics::Printable* video);

    webrtc::PeerConnectionInterface::IceServers _iceServers();
    // core::ThreadMutex _mutex;
    // core::ThreadCondition _localOfferCondition;
  };
}

#endif
