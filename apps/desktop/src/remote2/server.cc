#include "./server.h"
#include "talk/app/webrtc/test/fakeconstraints.h"
#include <iostream>
#include <json/json.h>

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


namespace remote {

  /**
   */

  Server::Server(base::Desktop* desktop):_signalThread(NULL) {
    _desktop = desktop;
    _createObservers();
    _createPeerFactory();
    _createDataChannels();
    _createMediaStreams();
    _createOffers();
    // _createThreads();
  }

  /**
   */

  Server::~Server() {
    // delete _peerConnectionObserver;

    // _signalThread->Stop();
    delete _signalThread;
  }

  /**
   */

  void Server::_createThreads() {
    // _signalThread = new rtc::Thread();
    // _signalThread->Start(this);
  }
  /**
   */

  void Server::connect(std::string host, const unsigned short port) {

    // TODO - add const for role
    // _peer = new Peer(host, 80, "remote-desktop", _signalThread);
    // _peer->start();
    // _signalThread->Start(_peer);
  }

  /**
   */

  void Server::Run(rtc::Thread* thread) {
    // _createObservers();
    // _createPeerFactory();
    // _createOffers();
  }

      // rtc::Thread::Current()->ProcessMessages(10);
  /**
   */

  void Server::_createObservers() {
    _peerConnectionObserver   = new rtc::RefCountedObject<PeerConnectionObserver>(this);
    _offerObserver            = new rtc::RefCountedObject<OfferObserver>(this);
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>(this);
    _localDescriptionObserver = new rtc::RefCountedObject<LocalDescriptionObserver>(this);

    _peerConnectionObserver->onIceCandidate.connect(this, &Server::_onIceCandidate);
    _offerObserver->onSuccess.connect(this, &Server::_onOfferSuccess);
    _localDescriptionObserver->onSuccess.connect(this, &Server::_onLocalDescriptionSuccuess);
  }

  void Server::_createMediaStreams() {

      VideoCapturer* vcapture = new VideoCapturer();
      // vcapture->set_enable_camera_list(true);

      rtc::scoped_refptr<webrtc::MediaStreamInterface> stream = _factory->CreateLocalMediaStream("simple_stream");

      rtc::scoped_refptr<webrtc::VideoSourceInterface> videoSource;
      videoSource = _factory->CreateVideoSource(vcapture, NULL);
      rtc::scoped_refptr<webrtc::VideoTrackInterface> videoTrack(_factory->CreateVideoTrack("simple_video", videoSource));
      stream->AddTrack(videoTrack);

      _connection->AddStream(stream);
  }

  /**
   */

  void Server::_onIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    std::cout << "ICY" << std::endl;
    std::string out;
    _connection->local_description()->ToString(&out);
    std::cout << "-----------------------" << std::endl;
    Json::Value value;
    value["type"] = "offer";
    value["sdp"]  = out;
    Json::FastWriter writer;
    std::cout << writer.write(value) << std::endl;
    std::cout << "-----------------------" << std::endl;
  }

  /**
   */

  void Server::_createDataChannels() {
    webrtc::DataChannelInit config;
    config.reliable = false;
    _dataChannel = _connection->CreateDataChannel("data", &config);
  }

  /**
   */

  void Server::_onOfferSuccess(webrtc::SessionDescriptionInterface* sdp) {
    _connection->SetLocalDescription(_localDescriptionObserver, sdp);
  }


  /**
   */

  void Server::_onLocalDescriptionSuccuess() {
    std::cout << "OFFER MUCH SUCC!" << std::endl;

  }

  /**
   */

  void Server::_createPeerFactory() {


    // constraints.AddMandatory(webrtc::MediaConstraintsInterface::kOfferToReceiveAudio, webrtc::MediaConstraintsInterface::kValueTrue);
    // constraints.AddMandatory(webrtc::MediaConstraintsInterface::kOfferToReceiveVideo, webrtc::MediaConstraintsInterface::kValueTrue);
    _constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableDtlsSrtp, webrtc::MediaConstraintsInterface::kValueTrue);
    // _constraints.AddMandatory(webrtc::MediaConstraintsInterface::kEnableDscp, webrtc::MediaConstraintsInterface::kValueTrue);
    // _constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableRtpDataChannels, webrtc::MediaConstraintsInterface::kValueTrue);

    _factory     = webrtc::CreatePeerConnectionFactory();
    _connection  = _factory->CreatePeerConnection(_iceServers(), &_constraints, NULL, NULL, _peerConnectionObserver.get());
  }

  /**
   */

  void Server::_createOffers() {
    _connection.get()->CreateOffer(_offerObserver.get(), &_constraints);
  }

  /**
   */

  webrtc::PeerConnectionInterface::IceServers Server::_iceServers() {
    webrtc::PeerConnectionInterface::IceServers servers;
    webrtc::PeerConnectionInterface::IceServer server1;

    server1.uri = "stun:stun.l.google.com:19302";

    servers.push_back(server1);
    return servers;
  }

  PeerConnectionObserver::PeerConnectionObserver(Server* server):_server(server) { }

  void PeerConnectionObserver::OnSignalingChange(webrtc::PeerConnectionInterface::SignalingState state) {
    std::cout << "-----signaling change" <<std::endl;
  }

  void PeerConnectionObserver::OnIceConnectionChange(webrtc::PeerConnectionInterface::IceConnectionState state) {
    std::cout << "-----ice connection change" <<std::endl;
  }

  void PeerConnectionObserver::OnIceGatheringChange(webrtc::PeerConnectionInterface::IceGatheringState state) {
    std::cout << "-----ice gathering" <<std::endl;
  }

  void PeerConnectionObserver::OnStateChange(webrtc::PeerConnectionObserver::StateType state) {
    // _listener->emit(kPeerConnectionStateChange);
    std::cout << "-----state change" <<std::endl;
  }

  void PeerConnectionObserver::OnIceCandidate(const webrtc::IceCandidateInterface* candidate) {
    std::cout << "-----ice candidate" <<std::endl;
    onIceCandidate.emit(candidate);

  }

  void PeerConnectionObserver::OnDataChannel(webrtc::DataChannelInterface* channel) {
    // _listener->emit(kPeerConnectionDataChannel);
    std::cout << "-----data channel" <<std::endl;
  }

  void PeerConnectionObserver::OnRenegotiationNeeded() {
    std::cout << "-----renegotiation needed" <<std::endl;
  }

  void PeerConnectionObserver::OnAddStream(webrtc::MediaStreamInterface* stream) {
    std::cout << "-----add stream" <<std::endl;
  }

  void PeerConnectionObserver::OnRemoveStream(webrtc::MediaStreamInterface* stream) {
    std::cout << "-----remove stream" <<std::endl;
  }


  OfferObserver::OfferObserver(Server* server):
  _server(server) {

  }


  void OfferObserver::OnSuccess(webrtc::SessionDescriptionInterface* sdp) {
    std::cout << "OFFER SUCCESS" << std::endl;
    onSuccess.emit(sdp);
  }

  void OfferObserver::OnFailure(const std::string &error) {
    std::cout << "OFFER FAIL" << std::endl;
    onFailure.emit(error);
  }

  LocalDescriptionObserver::LocalDescriptionObserver(Server* server):
  _server(server) {

  }


  void LocalDescriptionObserver::OnSuccess() {
    std::cout << "description SUCCESS" << std::endl;

    // string sd;
    // desc->ToString(&sd);
    // facade_->setLocalSessionDescription(sd);

    // webrtc::SessionDescriptionInterface* pSessionDescription = webrtc::CreateSessionDescription("offer", sd);
    // _server->_connection->SetLocalDescription(NULL, sdp);


    onSuccess.emit();
    // _server->_connection->SetLocalOffer()
  }

  void LocalDescriptionObserver::OnFailure(const std::string &error) {
    std::cout << "description SUCCESS" << std::endl;
    onFailure.emit(error);
  }

};
