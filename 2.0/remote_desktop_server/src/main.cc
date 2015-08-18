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


int main(int argc, const char * argv[]) {

    rtc::PeerConnection pc(rtc::Configuration(rtc::ICEServer("stun.l.google.com:19302")));


    return 0;
}
