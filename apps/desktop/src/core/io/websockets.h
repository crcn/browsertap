#ifndef IO_WEB_SOCKETS_H_
#define IO_WEB_SOCKETS_H_

#include "./base.h"
#include "../thread/thread.h"
#include <json/json.h>
#include <libwebsockets.h>
#include <list>

namespace io {

  class WebSocketBus;

  class WebSockets : public Base, public core::Runnable {
  friend class WebSocketBus;
  public:
    WebSockets(base::Application* application);
    void start();
    void* run();
    static void log(int level, const char* message);
    std::list<struct libwebsocket*> connections;
  private:
    core::Thread* _thread;
    struct libwebsocket* _lws;
  };
}

#endif
