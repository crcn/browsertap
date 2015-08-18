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

class WebRtcLogger : public rtc::StreamInterface {
public:
    WebRtcLogger() { }
    ~WebRtcLogger() { }

    rtc::StreamResult Read(void* buffer,
                                    size_t buffer_len,
                                    size_t* read,
                                    int* error) {
        // No-op, this is used for outbound logging only
        return rtc::SR_SUCCESS;
  }

  rtc::StreamResult Write(const void* data,
                                  size_t data_len,
                                  size_t* written,
                                  int* error) {
                                      return rtc::SR_SUCCESS;
                                  }

  rtc::StreamState GetState() const { return rtc::SS_OPEN; }

  virtual void Close() { }
};

int main(int argc, const char * argv[]) {
    

    osx::System* sys = new osx::System();

    std::vector<base::Window*> windows = sys->windows();

    std::cout << windows.at(1)->bounds().height << std::endl;
    //BaseWindow* screens = sys->getWindows();

//    if (screens != NULL) {
//        std::cout << "BLAH" << std::endl;
//    }


    WebRtcLogger* logger = new WebRtcLogger();

    graphics::Bitmap* image = windows.at(0)->print();
    std::cout << image->bounds.width << " " << image->bounds.height << std::endl;

    geom::Bounds b = geom::Bounds(100, 0, 100, 100);

    std::cout << b.x << std::endl;

    std::cout << "Hello World" << std::endl;

    return 0;
}
