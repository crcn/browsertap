#ifndef WRTC_CONNECTION_H_
#define WRTC_CONNECTION_H_


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
#include "./core.h"
#include "./observers.h"
#include <json/json.h>

namespace wrtc {
  class Connection : public sigslot::has_slots<> {
  public:
    Connection();

  private:
    rtc::scoped_refptr<PeerConnectionObserver> _peerConnectionObserver;
    rtc::scoped_refptr<OfferObserver> _offerObserver;
    rtc::scoped_refptr<LocalDescriptionObserver> _localDescriptionObserver;

    webrtc::FakeConstraints _constraints;
    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> _connection;
    rtc::scoped_refptr<webrtc::DataChannelInterface> _dataChannel;

    void _onOfferSuccess(webrtc::SessionDescriptionInterface* sdp);
    void _onIceCandidate(const webrtc::IceCandidateInterface* candidate);
    void _onLocalDescriptionSuccuess();

    webrtc::PeerConnectionInterface::IceServers _iceServers();
  };



class VideoCapturer : public cricket::VideoCapturer {
public:
  VideoCapturer() {
    std::vector<cricket::VideoFormat> supported;
    cricket::VideoFormat format(704, 576,
            FPS_TO_INTERVAL(15),
            cricket::FOURCC_I420);
    supported.push_back(format);
  }


  // Override virtual methods of parent class VideoCapturer.
  cricket::CaptureState Start(const cricket::VideoFormat& capture_format) {
    std::cout << "Called with Start " << std::endl;
    return cricket::CS_RUNNING;
  }
  void Stop() {
    std::cout << "Called with Stop " << std::endl;
    // SetCaptureFormat(NULL);
  };
  bool IsRunning() { return true; }
  bool IsScreencast() const { return false; }
  bool GetPreferredFourccs(std::vector<uint32>* fourccs) {
    std::cout << ">>>>>>>>>>>> Called with GetPreferredFourccs " << std::endl;

    if (!fourccs) {
        return false;
    }
    fourccs->push_back(cricket::FOURCC_I420);
    return true;
  };
};

}

#endif