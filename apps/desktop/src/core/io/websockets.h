#ifndef IO_WEB_SOCKETS_H_
#define IO_WEB_SOCKETS_H_

#include "./base.h"
#include "../thread/thread.h"
#include <json/json.h>
#include <libwebsockets.h>

namespace io {
  class WebSockets : public Base, public core::Runnable {
  public:
    WebSockets(base::Application* application);
    void start();
    void run();
    static void log(int level, const char* message);
  private:
    core::Thread* _thread;
    struct libwebsocket* _lws;
    void _tailOperations();
  };
}

#endif