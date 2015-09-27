#include "./websockets.h"
#include <iostream>
#include <pthread.h>
#include <libwebsockets.h>
#include <sstream>
#include <json/json.h>
#include "../json/serializeable.h"

static int callback_http(struct libwebsocket_context* _this,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason, void *user,
                         void *in, size_t len) {
  return 0;
}



static int callback_dumb_increment(struct libwebsocket_context * _this,
                                   struct libwebsocket *wsi,
                                   enum libwebsocket_callback_reasons reason,
                                   void *user, void *in, size_t len)
{

    base::Application* app = (base::Application*)libwebsocket_context_user(_this);

    switch (reason) {
        case LWS_CALLBACK_ESTABLISHED: // just log message that someone is connecting
            LOG_NOTICE("websockets: connection established");
            break;
        case LWS_CALLBACK_RECEIVE: { 

            unsigned char *buf = (unsigned char*) malloc(LWS_SEND_BUFFER_PRE_PADDING + len +
                                                         LWS_SEND_BUFFER_POST_PADDING);
            
            int i;

            Json::Value root;
            Json::Reader reader;

            for (i=0; i < len; i++) {
                buf[LWS_SEND_BUFFER_PRE_PADDING + (len - 1) - i ] = ((char *) in)[i];
            }

            if (reader.parse((char*)in, root)) {
              mesh::Request request(root["name"].asString(), &root);
              mesh::Response* response = app->bus->execute(&request);
              core::IJsonSerializable* chunk;

              // TODO - multithreading here
              while(chunk = (core::IJsonSerializable*)response->read()) {

                std::cout << chunk->toJson() << std::endl;

                // TODO - something like this
                // libwebsocket_write(wsi, &buf[LWS_SEND_BUFFER_PRE_PADDING], len, LWS_WRITE_TEXT);
              }
              delete response;
            } else {
              LOG_ERROR("unable to parse" << in);
            }
            
            // log what we recieved and what we're going to send as a response.
            // that disco syntax `%.*s` is used to print just a part of our buffer
            // http://stackoverflow.com/questions/5189071/print-part-of-char-array
            // printf("received data: %s, replying: %.*s\n", (char *) in, (int) len,
            //        buf + LWS_SEND_BUFFER_PRE_PADDING);
            
            // send response
            // just notice that we have to tell where exactly our response starts. That's
            // why there's `buf[LWS_SEND_BUFFER_PRE_PADDING]` and how long it is.
            // we know that our response has the same length as request because
            // it's the same message in reverse order.
            // libwebsocket_write(wsi, &buf[LWS_SEND_BUFFER_PRE_PADDING], len, LWS_WRITE_TEXT);
            
            // release memory back into the wild
            free(buf);
            break;
        }
        default:
            break;
    }
    
    return 0;
}


static struct libwebsocket_protocols protocols[] = {
    /* first protocol must always be HTTP handler */
    {
        "http-only",   // name
        callback_http, // callback
        0              // per_session_data_size
    },
    {
        "dumb-increment-protocol", // protocol name - very important!
        callback_dumb_increment,   // callback
        0                          // we don't use any per session data
    },
    {
        NULL, NULL, 0   /* End of list */
    }
};

namespace io {
  WebSockets::WebSockets(base::Application* app):io::Base(app) {
  }

  void WebSockets::start() {
    this->_thread = core::Thread::run(this);
  }

  void WebSockets::run() {


    struct libwebsocket_context *context;
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof(info));
    info.port = 9000;
    info.iface = NULL;
    info.protocols = protocols;
    info.extensions = libwebsocket_get_internal_extensions();
    info.ssl_cert_filepath = NULL;
    info.ssl_private_key_filepath = NULL;
    info.gid = -1;
    info.uid = -1;
    info.user = (void *)this->app;
    info.options = 0;

    lws_set_log_level(LLL_ERR | LLL_WARN | LLL_NOTICE, &log);


    // create libwebsocket context representing this server
    context = libwebsocket_create_context(&info);

    if (context == NULL) {
        LOG_ERROR("libwebsocket init failed");
        return;
    }
    
    // infinite loop, to end this server send SIGTERM. (CTRL+C)
    while (1) {
        libwebsocket_service(context, 50);
        // libwebsocket_service will process all waiting events with their
        // callback functions and then wait 50 ms.
        // (this is a single threaded webserver and this will keep our server
        // from generating load while there are not requests to process)
    }
    
    libwebsocket_context_destroy(context);
  }

  void WebSockets::_tailOperations() {
    mesh::Request tailRequest("tail");
    mesh::Response* resp = this->app->bus->execute(&tailRequest);
    mesh::Request* tailedRequest;
    while(tailedRequest = (mesh::Request*)resp->read()) {
      // TODO - broadcast here
    }
  }

  void WebSockets::log(int level, const char* line) {
    std::stringstream ss;

    ss << "websockets: ";
    ss << line;

    std::string str = ss.str();
    str.erase(std::remove(str.begin(), str.end(), '\n'), str.end());
    if (level & LLL_NOTICE) {
      LOG_VERBOSE(str);
    }
    if (level & LLL_ERR) {
      LOG_ERROR(str);
    }
    if (level & LLL_WARN) {
      LOG_WARN(str);
    }
  }
}
