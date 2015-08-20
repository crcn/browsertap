//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/system.h"
#include "./geom/bounds.h"

// #include "talk/app/webrtc/peerconnectionfactoryproxy.h"
// #include "talk/app/webrtc/proxy.h"
#include "webrtc/base/stream.h"
#include "./rtc/peer_connection.h"
#include "talk/app/webrtc/videotrack.h"
#include "talk/app/webrtc/mediastream.h"
#include "talk/app/webrtc/peerconnectioninterface.h"
#include "webrtc/base/ssladapter.h"

class VideoRenderer : public webrtc::VideoRendererInterface {
public:

  VideoRenderer(){};

  void RenderFrame(const cricket::VideoFrame* frame) {
    // std::cout << "RENDER" << std::endl;
  }
  void SetSize(int width, int height) {
    // std::cout << "SET SIZE" << std::endl;
  }
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

class DummySetSessionDescriptionObserver : public webrtc::SetSessionDescriptionObserver {
public:
        static DummySetSessionDescriptionObserver* Create() {
            return new rtc::RefCountedObject<DummySetSessionDescriptionObserver>();
        }

        void OnSuccess() {
            std::cout << "DummySetSessionDescriptionObserver: onSuccess" << std::endl;
        }

        void OnFailure(const std::string& error) {
            std::cout << "DummySetSessionDescriptionObserver::OnFailure" << std::endl;
        }

protected:
        DummySetSessionDescriptionObserver() {}
        ~DummySetSessionDescriptionObserver() {}
};



namespace n2b{

class Constraints : public webrtc::MediaConstraintsInterface
{
public:

  explicit Constraints();
  virtual ~Constraints();

  virtual const webrtc::MediaConstraintsInterface::Constraints& GetMandatory() const;
  virtual const webrtc::MediaConstraintsInterface::Constraints& GetOptional() const;

  template <class T>
  void AddMandatory(const std::string& key, const T& value) {
    _mandatory.push_back(webrtc::MediaConstraintsInterface::Constraint(key, rtc::ToString<T>(value)));
  }

  template <class T>
  void AddOptional(const std::string& key, const T& value) {
    _optional.push_back(webrtc::MediaConstraintsInterface::Constraint(key, rtc::ToString<T>(value)));
  }

  template <class T>
  void SetMandatory(const std::string& key, const T& value) {
    std::string value_str;
    if (_mandatory.FindFirst(key, &value_str)) {
      for (webrtc::MediaConstraintsInterface::Constraints::iterator iter = _mandatory.begin();
        iter != _mandatory.end(); ++iter) {
        if (iter->key == key) {
          _mandatory.erase(iter);
          break;
        }
      }
    }
    _mandatory.push_back(webrtc::MediaConstraintsInterface::Constraint(key, rtc::ToString<T>(value)));
  }

  template <class T>
  void SetOptional(const std::string& key, const T& value) {
    std::string value_str;
    if (_optional.FindFirst(key, &value_str)) {
      for (webrtc::MediaConstraintsInterface::Constraints::iterator iter = _optional.begin();
        iter != _optional.end(); ++iter) {
        if (iter->key == key) {
          _optional.erase(iter);
          break;
        }
      }
    }
    _optional.push_back(webrtc::MediaConstraintsInterface::Constraint(key, rtc::ToString<T>(value)));
  }

private:
    
  webrtc::MediaConstraintsInterface::Constraints _mandatory;
  webrtc::MediaConstraintsInterface::Constraints _optional;

};//end class Constraints

}//end namespace n2b

namespace n2b{

Constraints::Constraints(){

}

Constraints::~Constraints(){

}

const webrtc::MediaConstraintsInterface::Constraints& Constraints::GetMandatory() const{
  return _mandatory;
}

const webrtc::MediaConstraintsInterface::Constraints& Constraints::GetOptional() const{
  return _optional;
}

}

rtc::scoped_refptr<webrtc::PeerConnectionInterface> create() {
  webrtc::PeerConnectionInterface::IceServers iceServers;
    webrtc::PeerConnectionInterface::IceServer iceServer;
    iceServer.uri = "stun:stun.l.google.com:19302";

    iceServers.push_back(iceServer);


    rtc::PeerConnectionObserver* peer = new rtc::RefCountedObject<rtc::PeerConnectionObserver>(new core::EventEmitter());

    n2b::Constraints constraints;

    // constraints.SetAllowDtlsSctpDataChannels();
    constraints.AddMandatory(webrtc::MediaConstraintsInterface::kOfferToReceiveAudio, webrtc::MediaConstraintsInterface::kValueTrue);
    constraints.AddMandatory(webrtc::MediaConstraintsInterface::kOfferToReceiveVideo, webrtc::MediaConstraintsInterface::kValueTrue);
    constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableDtlsSrtp, webrtc::MediaConstraintsInterface::kValueFalse);
    constraints.AddOptional(webrtc::MediaConstraintsInterface::kEnableRtpDataChannels, webrtc::MediaConstraintsInterface::kValueFalse);


    std::cout << "PEER CONNECT" << std::endl;
    // constraints.SetAllowDtlsSctpKeyAgreement();
    // DtlsSrtpKeyAgreement:true

    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> factory = webrtc::CreatePeerConnectionFactory();


    std::cout << "PEER CONNECT" << std::endl;
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> pc = factory->CreatePeerConnection(iceServers, &constraints, NULL, NULL, peer);
    return pc;
}


void run() {

    rtc::scoped_refptr<webrtc::PeerConnectionInterface> pc = create();
    // rtc::PeerConnection pc(rtc::Configuration(rtc::IceServer("stun.l.google.com:19302")));

    // VideoCapturer* vcapture = new VideoCapturer();
    // vcapture->set_enable_camera_list(true);

    // rtc::scoped_refptr<webrtc::MediaStreamInterface> stream = factory->CreateLocalMediaStream("simple_stream");

    // rtc::scoped_refptr<webrtc::VideoSourceInterface> videoSource;
    // videoSource = factory->CreateVideoSource(vcapture, NULL);
    // rtc::scoped_refptr<webrtc::VideoTrackInterface> videoTrack(factory->CreateVideoTrack("simple_video", videoSource));
    // stream->AddTrack(videoTrack);


    // pc.get()->AddStream(stream);

    std::cout << "creating offer" << std::endl;

    rtc::OfferObserver* offerObserver = new rtc::RefCountedObject<rtc::OfferObserver>(new core::EventEmitter());
    pc->CreateOffer(offerObserver, NULL);

}


int main(int argc, const char * argv[]) {

rtc::InitializeSSL();


    

    run();

    std::cout << "OK" << std::endl;

    return 0;

    // // REMOTE
    // std::cout << ">>> Awaiting remote SDP info >>>" << std::endl;
    // std::string remoteSdpInfo;


    // std::stringstream sdp;
    // std::string line;


    // while(std::getline(std::cin, line)) {
    //   if (line.empty()) break;
    //   // line >> sdp;
    //   sdp << line << "\r\n";
    // }


    // webrtc::SessionDescriptionInterface* remoteSessionDescription = webrtc::CreateSessionDescription("offer", sdp.str(), NULL);
    // pc->SetRemoteDescription(DummySetSessionDescriptionObserver::Create(), remoteSessionDescription);

    // std::cout << ">>>Awaiting remote ICE candidate >>>" << std::endl;
    // std::string remoteIceCandidate;
    // std::cin >> remoteIceCandidate;
    // while(1); /

    return 0;
}
