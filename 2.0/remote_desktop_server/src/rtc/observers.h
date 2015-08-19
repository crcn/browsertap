#ifndef _RTC_OBSERVERS_
#define _RTC_OBSERVERS_

#include "../core/event_emitter.h"

#include "webrtc/base/logging.h"
#include "webrtc/base/json.h"
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

namespace rtc {

  enum PeerConnectionEvent {
    kPeerConnectionCreateOffer = 1,
    kPeerConnectionCreateOfferError,
    kPeerConnectionCreateAnswer,
    kPeerConnectionCreateAnswerError,
    kPeerConnectionSetLocalDescription,
    kPeerConnectionSetLocalDescriptionError,
    kPeerConnectionSetRemoteDescription,
    kPeerConnectionSetRemoteDescriptionError,
    kPeerConnectionIceCandidate,
    kPeerConnectionSignalChange,
    kPeerConnectionIceChange,
    kPeerConnectionIceGathering,
    kPeerConnectionDataChannel,
    kPeerConnectionAddStream,
    kPeerConnectionRemoveStream,
    kPeerConnectionRenegotiation,
    kPeerConnectionStats
  };

  class OfferObserver : public webrtc::CreateSessionDescriptionObserver {
   public:
    OfferObserver(core::EventEmitter *listener);
    void OnSuccess(webrtc::SessionDescriptionInterface* sdp) final;
    void OnFailure(const std::string &error) final;
    
   protected:
    core::EventEmitter* _listener;
  };

  class PeerConnectionObserver : 
    public webrtc::PeerConnectionObserver, 
    public rtc::RefCountInterface 
  {
   public:
    PeerConnectionObserver(core::EventEmitter* listener);

    void OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) final;
    void OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) final;
    void OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) final;
    void OnStateChange(webrtc::PeerConnectionObserver::StateType state) final;
    void OnIceCandidate(const webrtc::IceCandidateInterface* candidate) final;
    void OnDataChannel(webrtc::DataChannelInterface* channel) final;
    void OnRenegotiationNeeded() final;

    void OnAddStream(webrtc::MediaStreamInterface* stream) final;
    void OnRemoveStream(webrtc::MediaStreamInterface* stream) final;

   protected:
    core::EventEmitter* _listener;
  };
};

#endif