#ifndef APP_MAIN_SESSION_RESPONSE_H_
#define APP_MAIN_SESSION_RESPONSE_H_

#include "../core/mesh/mesh.h"
#include "../core/events/event_listener.h"
#include "../core/thread/runnable.h"

namespace app {

  class CreateWrtcConnectionResponse : public core::EventListener, public mesh::Response, public core::Runnable {
  public:

    WRTCConnection* connection;

    /**
     */

    CreateWrtcConnectionResponse(Application* app):_app(app) {
      this->_response = new mesh::AsyncResponse(this);
    }

    /**
     */
    
    void* read() {
      return this->_response->read();
    }

    /**
     */
    
    void run() {
      this->_connection = new wrtc::Connection();
      this->_connection->addListener(this);
      connection = new WRTCConnection(this->_connection);
      this->_app->ardb->collection(WRTCConnection::COLLECTION_NAME)->insert(connection);
    }

    /**
     */

    void handleEvent(core::Event* event) {

      // TODO - add session info to internal DB
      this->_connection->removeListener(this);
      Json::Value value = *((Json::Value*)event->data);
      Json::FastWriter writer;
      this->_response->end((void *)writer.write(value).c_str());
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