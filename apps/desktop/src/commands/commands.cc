#include "./commands.h"
#include "../core/wrtc/connection.h"
#include "../active_records/wrtc_connection.h"
#include "../active_records/virt_window.h"
#include "./create_wrtc_connection_response.h"

namespace app {

  /**
   */

  Commands::Commands(Application* app):app(app) {
    LOG_INFO(__PRETTY_FUNCTION__);

    // replace the application bus with the commands bus. Note that
    // any commands that do not get executed against *registered* commands
    // here will go back to the original app bus.
    this->app->bus = (new mesh::CommandsBus(app->bus))
    ->add("ping", new mesh::FnBus(&this->execPong))
    ->add("find", new AppFnBus(app, &this->execFind))
    ->add("hydrate", new AppFnBus(app, &this->execHydrate))
    ->add("startWindowSession", new AppFnBus(app, &this->execStartWindowSession))
    ->add("getWindows", new mesh::FnBus(&this->execGetWindows))
    ; // coma here in case other commands are added
  }

  /**
   * return all desktop windows
   */

  mesh::Response* Commands::execHydrate(mesh::Request* request, Application* app) {
    LOG_INFO("hydrate app");

    // start the webrtc main session
    CreateWrtcConnectionResponse mainSessionResponse(app);
    while(mainSessionResponse.read());

    virt::Desktop* desktop = app->desktop;
    std::vector<virt::Window*> windows = desktop->windows();

    for (int i = 0, n = windows.size(); i < n; i++) {
      app->ardb->collection(app::VirtWindow::COLLECTION_NAME)->insert(new app::VirtWindow(windows.at(i)));
    }

    return new mesh::NoResponse();
  }

  /**
   * simple pong response
   */

  mesh::Response* Commands::execPong(mesh::Request* request) {
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

  mesh::Response* Commands::execStartWindowSession(mesh::Request* request, Application* app) {

    // TODO - check if window session already exists, return that

    Json::Value* data = (Json::Value*)request->data;
    int id = (*data)["query"]["id"].asInt();
    VirtWindow* window = (VirtWindow*)app->ardb->collection(VirtWindow::COLLECTION_NAME)->findOne(id);

    if (window == NULL) {
      // TODO - throw exception here
    }

    CreateWrtcConnectionResponse windowWrtcConnection(app);
    while(windowWrtcConnection.read());

    windowWrtcConnection.connection->setWindow(window);

    LOG_VERBOSE("DONE");

    // TODO - return webrtc connection
    return new mesh::NoResponse();
  }

  /**
   */

  mesh::Response* Commands::execFind(mesh::Request* request, Application* app) {
    Json::Value& root = *((Json::Value*)request->data);

    if (root["collection"].isNull()) {

      // TODO - make this an error object
      throw "collection must exist";
    }

    Json::Value& query = root["query"];

    activeRecord::Collection* c = app->ardb->collection(root["collection"].asString());
    std::vector<activeRecord::Object*> results = query.isNull() ? c->all() : c->find(query);

    for (int i = 0, n = results.size(); i < n; i++) {
      std::cout << results.at(i)->toJSON() << std::endl;
    }

    return new mesh::NoResponse();
  }
}