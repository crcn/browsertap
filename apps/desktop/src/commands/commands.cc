#include "./commands.h"
#include "../wrtc/connection.h"

/**
 */

app::Commands::Commands(base::Application* app):app(app) {
  LOG_INFO(__PRETTY_FUNCTION__);

  // replace the application bus with the commands bus. Note that
  // any commands that do not get executed against *registered* commands
  // here will go back to the original app bus.
  this->app->bus = (new mesh::CommandsBus(app->bus))
  ->add("ping", new mesh::FnBus(&this->pong))
  ->add("getWindows", new mesh::FnBus(&this->execGetWindows))
  ->add("startMainSession", new mesh::FnBus(&this->execStartMainSession))
  ->add("startWindowSession", new mesh::FnBus(&this->execStartWindowSession));
}

/**
 * return all desktop windows
 */

mesh::Response* app::Commands::pong(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("pong");
}

/**
 * return all desktop windows
 */

mesh::Response* app::Commands::execGetWindows(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("get windows");
}

/**
 * start a window session. Note that the session will close once the 
 * initialized session drops all connections.
 */

mesh::Response* app::Commands::execStartWindowSession(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("start session");
}

/**
 * TODO: move this to another file
 */

class MainSessionResponse : public core::EventListener, public mesh::Response, public core::Runnable {
public:

  MainSessionResponse(mesh::Request* request):core::EventListener() {
    this->_response = new mesh::AsyncResponse(this);
  }

  void* read() {
    return this->_response->read();
  }

  void run() {
    this->_connection = new wrtc::Connection(NULL);
    this->_connection->addListener(this);
  }

  void handleEvent(core::Event* event) {
    Json::Value value = *((Json::Value*)event->data);
    Json::FastWriter writer;
    this->_response->end((void *)writer.write(value).c_str());
  }

  ~MainSessionResponse() {
    delete this->_response;
    delete this->_connection;
  }
private:
  mesh::AsyncResponse* _response;
  wrtc::Connection* _connection;
};

/**
 */

mesh::Response* app::Commands::execStartMainSession(mesh::Request* request) {
  return new MainSessionResponse(request);
}