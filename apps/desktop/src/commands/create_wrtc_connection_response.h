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
      this->_connection = new wrtc::Connection(video);
      connection = new WRTCConnection(this->_connection);
      this->_app->ardb->collection(WRTCConnection::COLLECTION_NAME)->insert(connection);
      this->_connection->addListener(this);
      this->_response = new mesh::AsyncResponse();
    }

    /**
     */
    
    void* read() {
      return this->_response->read();
    }

    /**
     */

    void handleEvent(core::Event* event) {
      this->_connection->removeListener(this);
      this->_response->end(this->_connection);
    }

    /**
     */

    ~CreateWrtcConnectionResponse() {
      delete this->_response;
      // delete this->_connection;
    }



  private:
    mesh::AsyncResponse* _response;
    wrtc::Connection* _connection;
    Application* _app;
  };
};
#endif