#include "./commands.h"
#include "../core/wrtc/connection.h"
#include "../active_records/wrtc_connection.h"

namespace app {
  /**
   */

  Commands::Commands(base::Application* app):app(app) {
    LOG_INFO(__PRETTY_FUNCTION__);

    // replace the application bus with the commands bus. Note that
    // any commands that do not get executed against *registered* commands
    // here will go back to the original app bus.
    this->app->bus = new mesh::FnBus(&this->execStartMainSession);
  }

  /**
   * return all desktop windows
   */

  mesh::Response* Commands::pong(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("pong");
  }

  /**
   * return all desktop windows
   */

  mesh::Response* Commands::execGetWindows(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("get windows");
  }

  /**
   * start a window session. Note that the session will close once the 
   * initialized session drops all connections.
   */

  mesh::Response* Commands::execStartWindowSession(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("start session");
  }

  /**
   */

  // class

  /**
   * TODO: move this to another file
   */

  class MainSessionResponse : public core::EventListener, public mesh::Response, public core::Runnable {
  public:

    MainSessionResponse(Application* app, mesh::Request* request):_app(app) {
      this->_response = new mesh::AsyncResponse(this);
    }

    void* read() {
      return this->_response->read();
    }

    void run() {

      this->_connection = new wrtc::Connection();
      this->_connection->addListener(this);
      
      this->_app->ardb->collection(WRTCConnection::COLLECTION_NAME)->insert(new WRTCConnection());
    }

    void handleEvent(core::Event* event) {

      // TODO - add session info to internal DB
      this->_connection->removeListener(this);
      Json::Value value = *((Json::Value*)event->data);
      Json::FastWriter writer;
      this->_response->end((void *)writer.write(value).c_str());
    }

    ~MainSessionResponse() {
      delete this->_response;
      // delete this->_connection;
    }
  private:
    mesh::AsyncResponse* _response;
    wrtc::Connection* _connection;
    Application* _app;
  };

  /**
   */

  mesh::Response* Commands::execStartMainSession(mesh::Request* request) {
    return new MainSessionResponse(NULL, request);
  }
}