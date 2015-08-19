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
#include "./rtc/configuration.h"
#include "talk/app/webrtc/videotrack.h"
#include "talk/app/webrtc/mediastream.h"

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


int main(int argc, const char * argv[]) {

    // rtc::PeerConnection pc(rtc::Configuration(rtc::IceServer("stun.l.google.com:19302")));

    rtc::scoped_refptr<webrtc::PeerConnectionInterface> socket;


    webrtc::PeerConnectionInterface::IceServers iceServers;

    iceServers.push_back(rtc::IceServer("stun:stun.l.google.com:19302"));


    rtc::scoped_refptr<rtc::PeerConnectionObserver> peer = new rtc::RefCountedObject<rtc::PeerConnectionObserver>(new core::EventEmitter());

    webrtc::FakeConstraints constraints;

    constraints.SetAllowDtlsSctpDataChannels();

    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> factory = webrtc::CreatePeerConnectionFactory();
    socket = factory->CreatePeerConnection(iceServers, &constraints, NULL, NULL, peer.get());

    VideoCapturer* vcapture = new VideoCapturer();
    // vcapture->set_enable_camera_list(true);

    rtc::scoped_refptr<webrtc::MediaStreamInterface> stream = factory->CreateLocalMediaStream("simple_stream");

    rtc::scoped_refptr<webrtc::VideoSourceInterface> videoSource;
    videoSource = factory->CreateVideoSource(vcapture, NULL);
    rtc::scoped_refptr<webrtc::VideoTrackInterface> videoTrack(factory->CreateVideoTrack("simple_video", videoSource));
    stream->AddTrack(videoTrack);


    socket.get()->AddStream(stream);

    std::cout << "END" << std::endl;

    while(1);


    return 0;
}
