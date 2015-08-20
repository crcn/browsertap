#ifndef __REMOTE_PEER__
#define __REMOTE_PEER__

#include "webrtc/base/thread.h"
#include "webrtc/base/messagequeue.h"
#include <stdio.h>
#include <vector>

namespace remote {
  class Peer : public sigslot::has_slots<>, public rtc::MessageHandler, public rtc::Runnable {
  public:

    Peer(std::string server, const unsigned short port, std::string role, rtc::Thread* workerThread);

    sigslot::signal1<bool> signalOnline;
    sigslot::signal0<> signalOffline;
    sigslot::signal2<const std::string &, const std::string &> signalRemoteOnline;
    sigslot::signal1<const std::string &> signalRemoteOffline;
    sigslot::signal2<const std::string &, const std::vector<std::string>&> signalRemoteMessage;
    sigslot::signal1<const std::string &> signalPrintString;    

    void start();
    void Run(rtc::Thread* thread);
    virtual void OnMessage(rtc::Message *msg);

  private:
    std::string _server;
    rtc::Thread* _workerThread;
    unsigned short _port;
    std::string _role;
  };
}

#endif