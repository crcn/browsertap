#include "talk/app/webrtc/test/fakeconstraints.h"
#include "./connection.h"

namespace wrtc {

  /**
   */

  Connection::Connection() {

    // observers
    _peerConnectionObserver   = new rtc::RefCountedObject<PeerConnectionObserver>(this);
    _offerObserver            = new rtc::RefCountedObject<OfferObserver>(this);
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>(this);
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>(this);

    _peerConnectionObserver->onIceCandidate.connect(this, &Connection::_onIceCandidate);
    _peerConnectionObserver->onIceGatheringChange.connect(this, &Connection::_onIceGatheringChange);
    _offerObserver->onSuccess.connect(this, &Connection::_onOfferSuccess);
    _localDescriptionObserver->onSuccess.connect(this, &Connection::_onLocalDescriptionSuccuess);

    _constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableDtlsSrtp, webrtc::MediaConstraintsInterface::kValueTrue);
    _factory     = webrtc::CreatePeerConnectionFactory();
    _connection  = _factory->CreatePeerConnection(_iceServers(), &_constraints, NULL, NULL, _peerConnectionObserver.get());

    webrtc::DataChannelInit config;
    config.reliable = false;
    _dataChannel = _connection->CreateDataChannel("data", &config);


    // VideoCapturer* vcapture = new VideoCapturer();
    // rtc::scoped_refptr<webrtc::MediaStreamInterface> stream = _factory->CreateLocalMediaStream("simple_stream");

    // rtc::scoped_refptr<webrtc::VideoSourceInterface> videoSource;
    // videoSource = _factory->CreateVideoSource(vcapture, NULL);
    // rtc::scoped_refptr<webrtc::VideoTrackInterface> videoTrack(_factory->CreateVideoTrack("simple_video", videoSource));
    // stream->AddTrack(videoTrack);

    // _connection->AddStream(stream);

    _connection.get()->CreateOffer(_offerObserver.get(), &_constraints);
  }

  /**
   */

  void Connection::_onIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    LOG_VERBOSE("Connection::_onIceCandidate");
    // std::string out;
    // _connection->local_description()->ToString(&out);
    // std::cout << "-----------------------" << std::endl;
    // Json::Value value;
    // value["type"] = "offer";
    // value["sdp"]  = out;
    // Json::FastWriter writer;
    // std::cout << writer.write(value) << std::endl;
  }

  /**
   */

  void Connection::_onIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    LOG_VERBOSE("Connection::_onIceGatheringChange");

    switch(state) {
      case webrtc::PeerConnectionInterface::kIceConnectionConnected: 
        this->_onIceConnectionConnected();
        break;
    }
  } 

  /**
   */

  void Connection::_onIceConnectionConnected() {
    LOG_NOTICE("Connection::_onIceConnectionConnected");
  } 

  /**
   */

  void Connection::_onOfferSuccess(webrtc::SessionDescriptionInterface* sdp) {
    _connection->SetLocalDescription(_localDescriptionObserver, sdp);
  }

  /**
   */

  void Connection::_onLocalDescriptionSuccuess() {
    LOG_VERBOSE("Connection::_onLocalDescriptionSuccuess");
  }
  /**
   */

  webrtc::PeerConnectionInterface::IceServers Connection::_iceServers() {
    webrtc::PeerConnectionInterface::IceServers servers;
    webrtc::PeerConnectionInterface::IceServer server1;

    server1.uri = "stun:stun.l.google.com:19302";

    servers.push_back(server1);
    return servers;
  }
}