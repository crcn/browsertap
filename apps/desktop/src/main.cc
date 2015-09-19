//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/desktop.h"
// #include "./remote/server.h"
#include "./remote/commands.h"
// #include "./remote/transports.h"
#include "./geom/bounds.h"
#include <json/json.h>
#include "./core/mesh/sequence.h"
#include "./core/mesh/commands.h"
#include "./core/mesh/accept.h"
#include "./core/mesh/reject.h"
// class Runnable : public rtc::Runnable {
//   void Run(rtc::Thread* thread) {

//   }
// };

class EchoBus : public mesh::Bus {
public:
  virtual void execute(mesh::Request* request) {
    std::cout << request->name << std::endl;
  }
};

class EchoRejectBus : public mesh::Bus {
public:
  virtual void execute(mesh::Request* request) {
    std::cout << "Rejected!" << std::endl;
  }
};

// template class mesh::SequenceBus<1>;

int main(int argc, const char * argv[]) {


  // new AcceptBus()
  // new CommandsBus()

  mesh::SequenceBus* bus = (new mesh::SequenceBus())
  ->add((new mesh::CommandsBus())->add("hello world", new EchoBus()))
  ->add(new EchoBus());

  mesh::AcceptBus* bb = new mesh::AcceptBus([](mesh::Request* request) -> bool {
    return request->name.find("reject") == std::string::npos;
  }, new EchoBus(), new EchoRejectBus());

  bb->execute(new mesh::Request("reject"));
  bb->execute(new mesh::Request("accept"));

  // bus->execute(new mesh::Request("hello world"));
  // bus->execute(new mesh::Request("hello"));

  // mesh::SequenceBus<SomeBus*> bus(busses);
  // mesh::SequenceBus<SomeBus> bus(new SomeBus());

  // bus.execute();
  // bus.push(new SomeBus());

  // bus.execute();

  // rtc::InitializeSSL();
  std::cout << "RUN!" << std::endl;


  osx::Desktop* desktop = new osx::Desktop();

  std::vector<base::Window*> windows = desktop->windows();

  std::cout << windows.size() << std::endl;

  for(int i = 0, n = windows.size(); i < n; i++) {
    std::cout << windows.at(i)->print() << std::endl;
  }

  // remote::Server* server = new remote::Server(desktop); 
  // server->connect("host", 8080);

  // std::cout << "CON" << std::endl;
  // std::string item;

  // while(1) {
  //   rtc::Thread::Current()->ProcessMessages(10);
  //   sleep(1);
  // }

  // delete server;

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
