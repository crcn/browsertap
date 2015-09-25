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
    int callback_dumb_increment2(struct libwebsocket_context * _this,
                                   struct libwebsocket *wsi,
                                   enum libwebsocket_callback_reasons reason,
                                   void *user, void *in, size_t len);
  };
}

#endif