#ifndef APP_MAIN_SESSION_RESPONSE_H_
#define APP_MAIN_SESSION_RESPONSE_H_

#include "../core/mesh/mesh.h"
#include "../core/events/event_listener.h"
#include "../core/thread/runnable.h"

namespace app {

  class CreateWrtcConnectionResponse : public core::EventListener, public mesh::Response {
  public:

    WRTCConnection* connection;

    /**
     */

    CreateWrtcConnectionResponse(Application* app, graphics::Printable* video = NULL):_app(app) {
      _connection = new wrtc::Connection(video);
      connection = new WRTCConnection(_connection);
      _app->ardb->collection(WRTCConnection::COLLECTION_NAME)->insert(connection);
      _connection->addListener(this);
      _response = new mesh::AsyncResponse();
    }

    /**
     */
    
    void* read() {
      return _response->read();
    }

    /**
     */

    void handleEvent(core::Event* event) {
      _connection->removeListener(this);
      _response->end(_connection);
    }

    /**
     */

    ~CreateWrtcConnectionResponse() {
      delete _response;
      // delete _connection;
    }



  private:
    mesh::AsyncResponse* _response;
    wrtc::Connection* _connection;
    Application* _app;
  };
};
#endif