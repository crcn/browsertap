#include "./peer.h"
#include <iostream>

namespace remote {
  Peer::Peer(std::string server, const unsigned short port, std::string role, rtc::Thread* workerThread) {
    _server       = server;
    _port         = port;
    _role         = role;
    _workerThread = workerThread;
  }

  void Peer::start() {
    _workerThread->Post(this, 1); 
  }

  void Peer::Run(rtc::Thread* thread) {
    std::cout << "RUN" << std::endl;
  }

  void Peer::OnMessage(rtc::Message *msg) {

  }
};