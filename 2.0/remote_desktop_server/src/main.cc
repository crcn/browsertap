//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/desktop.h"
#include "./remote/server.h"
#include "./geom/bounds.h"

class Runnable : public rtc::Runnable {
  void Run(rtc::Thread* thread) {

  }
};


int main(int argc, const char * argv[]) {


  // rtc::InitializeSSL();
  std::cout << "RUN" << std::endl;

  osx::Desktop* desktop = new osx::Desktop();
  remote::Server* server = new remote::Server(desktop); 
  server->connect("host", 8080);

  std::cout << "CON" << std::endl;
  std::string item;

  while(1) {
    rtc::Thread::Current()->ProcessMessages(10);
    sleep(1);
  }

  delete server;

  /*

  osx::Desktop desktop = new osx::Desktop();
  signal::Stomp signal;

  remote::Server()

  rtc::DesktopClient 
  
  rtc::Desktop desktop(desktop)

  serve::Desktop desktop(&sys, &signal);
  remoteDesktop.setSecret("abba");

  */

  // webrtc::PeerConnectionInterface::IceServers servers;
  // webrtc::PeerConnectionInterface::IceServer server;
  // server.uri = "stun:stun.l.google.com:19302";
  // servers.push_back(server);

  // rtc::PeerConnection* pc = new rtc::PeerConnection(servers);
  return 0;
}
