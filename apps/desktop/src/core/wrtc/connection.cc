#include "talk/app/webrtc/test/fakeconstraints.h"
#include "./printable_video_capturer.h"
#include "./connection.h"
#include "./core.h"

namespace wrtc {

  /**
   */

  Connection::Connection():Connection(NULL) {

  }

  /**
   */

  Connection::Connection(graphics::Printable* video):video(video), localDescription(NULL) {

    // observers
    _peerConnectionObserver   = new rtc::RefCountedObject<PeerConnectionObserver>();
    _offerObserver            = new rtc::RefCountedObject<OfferObserver>();
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>();
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>();
    _dataChannelObserver      = new rtc::RefCountedObject<DataChannelObserver>();

    _peerConnectionObserver->onIceCandidate.connect(this, &Connection::_onIceCandidate);
    _peerConnectionObserver->onStateChange.connect(this, &Connection::_onStateChange);
    _peerConnectionObserver->onIceGatheringChange.connect(this, &Connection::_onIceGatheringChange);
    _offerObserver->onSuccess.connect(this, &Connection::_onOfferSuccess);
    _localDescriptionObserver->onSuccess.connect(this, &Connection::_onLocalDescriptionSuccess);
    _dataChannelObserver->onMessage.connect(this, &Connection::_onDataChannelMessage);

    _constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableDtlsSrtp, webrtc::MediaConstraintsInterface::kValueTrue);
    _factory     = Core::GetFactory();
    _connection  = _factory->CreatePeerConnection(_iceServers(), &_constraints, NULL, NULL, _peerConnectionObserver.get());

    webrtc::DataChannelInit config;
    config.reliable = false;
    _dataChannel = _connection->CreateDataChannel("data", &config);


    _dataChannel->RegisterObserver(_dataChannelObserver);

    if (video != NULL) this->_setVideo(video);

    _connection.get()->CreateOffer(_offerObserver.get(), &_constraints);
  }

  /**
   */

  void Connection::_onIceCandidate(const webrtc::IceCandidateInterface* candidate) {
  }

  /**
   */

  void Connection::_setVideo(graphics::Printable* video) {
    // this->video = video;

    // std::cout << video->print() << std::endl;
    PrintableVideoCapturer* capturer = new PrintableVideoCapturer(video);

    rtc::scoped_refptr<webrtc::VideoSourceInterface> videoSource = _factory->CreateVideoSource(capturer, NULL);
    rtc::scoped_refptr<webrtc::VideoTrackInterface> videoTrack(_factory->CreateVideoTrack("screen", videoSource));
    rtc::scoped_refptr<webrtc::MediaStreamInterface> stream = _factory->CreateLocalMediaStream("stream");

    // videoTrack->AddRenderer(new PrintableVideoRenderer());

    if (!stream.get()) {
      LOG_ERROR("Cannot create stream");
    } else {
      LOG_NOTICE("set video track");
      stream->AddTrack(videoTrack);
    
      if (!this->_connection->AddStream(stream)) {
        LOG_ERROR("Adding stream to PeerConnection failed");
      }
    }
  }

  /**
   */

  void Connection::_onStateChange(webrtc::PeerConnectionObserver::StateType state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  /**
   */

  void Connection::_onIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);

    switch(state) {
      case webrtc::PeerConnectionInterface::kIceConnectionConnected: 
        this->_onIceConnectionConnected();
        break;
    }
  } 

  /**
   */

  void Connection::_onIceConnectionConnected() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);

    std::string out;
    _connection->local_description()->ToString(&out);
    Json::Value value;
    this->localDescription = new SessionDescription("offer", out);
    this->emit(ConnectionEvent::WRTC_OFFER, this->localDescription);
  } 

  /**
   */

  void Connection::setRemoteDescription(SessionDescription description) {
    webrtc::SdpParseError error;

    webrtc::SessionDescriptionInterface* sd(webrtc::CreateSessionDescription(description.type, description.sdp, &error));
    if (!sd) {
        LOG_ERROR(error.description.c_str());
        LOG(WARNING) << "Can't parse received session description message."; 
        return;
    }

    _connection->SetRemoteDescription(new rtc::RefCountedObject<LocalDescriptionObserver>(), sd);
  }

  /**
   */

  void Connection::_onDataChannelMessage(const webrtc::DataBuffer& buffer) {

    std::string msg;
    msg.assign((const char *)buffer.data.data(), (size_t)buffer.data.size());

    LOG_INFO(msg);
  }

  /**
   */

  void Connection::_onOfferSuccess(webrtc::SessionDescriptionInterface* sdp) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    _connection->SetLocalDescription(_localDescriptionObserver, sdp);
  }

  /**
   */

  void Connection::_onLocalDescriptionSuccess() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
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