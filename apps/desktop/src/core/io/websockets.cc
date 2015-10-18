#include "./websockets.h"
#include <iostream>
#include <libwebsockets.h>
#include <sstream>
#include <json/json.h>
#include "../json/serializeable.h"
#include "../thread/task.h"
#include "../mesh/mesh.h"

static int callback_http(struct libwebsocket_context* _this,
  struct libwebsocket *wsi,
  enum libwebsocket_callback_reasons reason, void *user,
  void *in, size_t len) {
    return 0;
  }

  static int write_json(Json::Value resp, struct libwebsocket *wsi) {
    Json::FastWriter writer;

    std::string jsonResp =  writer.write(resp);

    unsigned char *buf = (unsigned char*) malloc(LWS_SEND_BUFFER_PRE_PADDING + jsonResp.size() +
    LWS_SEND_BUFFER_POST_PADDING);


    unsigned char *p = &buf[LWS_SEND_BUFFER_PRE_PADDING];
    memcpy(p, jsonResp.c_str(), jsonResp.size());

    libwebsocket_write(wsi, p, jsonResp.size(), LWS_WRITE_TEXT);

    free(buf);
    return 0;
  }

  class BusTask : public core::Task {
  public:
    BusTask(Json::Value root, base::Application* app, struct libwebsocket *wsi):
    _app(app),
    _root(root),
    _wsi(wsi) {

    }
    void* run() {

      mesh::Request request(_root["name"].asString(), &_root);

      mesh::Response* response = _app->bus->execute(&request);
      core::IJsonSerializable* chunk;

      Json::FastWriter writer;
      Json::Value resp;
      resp["resp"] = _root["id"];

      // TODO - multithreading here
      while(chunk = (core::IJsonSerializable*)response->read()) {
        resp["data"] = chunk->toJson();
        write_json(resp, _wsi);
      }

      resp["data"] = Json::nullValue;
      write_json(resp, _wsi);
      delete response;
      return nullptr;
    }
  private:
    base::Application* _app;
    struct libwebsocket *_wsi;
    Json::Value _root;
  };

  static int callback_dumb_increment(struct libwebsocket_context * _this,
    struct libwebsocket *wsi,
    enum libwebsocket_callback_reasons reason,
    void *user, void *in, size_t len)
    {

      io::WebSockets* ws = (io::WebSockets*)libwebsocket_context_user(_this);

      switch (reason) {
        case LWS_CALLBACK_ESTABLISHED: // just log message that someone is connecting

        // TODO - create active record here of WSI
        LOG_NOTICE("websockets: connection established");
        ws->connections.push_back(wsi);
        break;
        case LWS_CALLBACK_RECEIVE: {

          int i;

          Json::Value root;
          Json::Reader reader;

          if (reader.parse((char*)in, root)) {
            ws->app->tasks.run(new BusTask(root, ws->app, wsi));
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
          // free(buf);
          break;
        }
        case LWS_CALLBACK_CLOSED:
        // remove active record here
        ws->connections.remove(wsi);
        // TODO - ws->app->bus->execute({ })
        break;
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

      class WebSocketBus : public mesh::Bus {
      public:
        WebSocketBus(mesh::Bus* mainBus, WebSockets* ws):
        _mainBus(mainBus),
        _ws(ws) {

        }

        mesh::Response* execute(mesh::Request* request) {

          // oplog emitted by active record db
          if (request->name.compare("operation") == 0) {
            for (std::list<libwebsocket *>::iterator it = _ws->connections.begin(); it != _ws->connections.end(); ++it) {
              write_json(*((Json::Value*)request->data), *it);
            }
          }

          return _mainBus->execute(request);
        }
      private:
        mesh::Bus* _mainBus;
        WebSockets* _ws;
      };


      WebSockets::WebSockets(base::Application* app):io::Base(app) {
      }

      void WebSockets::start() {
        _thread = core::Thread::run(this);
      }

      void* WebSockets::run() {

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
        info.user = (void *)this;
        info.options = 0;

        lws_set_log_level(LLL_ERR | LLL_WARN | LLL_NOTICE, &log);

        // create libwebsocket context representing this server
        context = libwebsocket_create_context(&info);

        if (context == NULL) {
          LOG_ERROR("libwebsocket init failed");
          return NULL;
        }

        app->bus = WebSocketBus.create(app->bus, this);

        // infinite loop, to end this server send SIGTERM. (CTRL+C)
        while (1) {
          libwebsocket_service(context, 50);
          // libwebsocket_service will process all waiting events with their
          // callback functions and then wait 50 ms.
          // (this is a single threaded webserver and this will keep our server
          // from generating load while there are not requests to process)
        }

        libwebsocket_context_destroy(context);

        return NULL;
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
