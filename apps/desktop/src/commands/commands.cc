#include "./commands.h"
#include "../core/wrtc/connection.h"
#include "../active_records/wrtc_connection.h"
#include "../active_records/virt_window.h"
#include "./create_wrtc_connection_response.h"
#include "../core/json/chunk.h"

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
    ->add("setRemoteAnswer", new AppFnBus(app, &this->execSetRemoteAnswer))
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

      // todo - change to app->ardb->insert(activeRecord) - AR should have collection name here
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

    LOG_VERBOSE(__PRETTY_FUNCTION__);

    // TODO - check if window session already exists, return that

    Json::Value* data = (Json::Value*)request->data;
    int id = (*data)["query"]["id"].asInt();

    Json::Value wrtcQuery;
    wrtcQuery["video"]["id"] = id;

    // TODO - check for user here
    WRTCConnection* connection = (WRTCConnection*)app->ardb->collection(WRTCConnection::COLLECTION_NAME)->findOne(wrtcQuery);

    if (connection == NULL) {

      // TODO - change to app->ardb->findOne() with query info here
      VirtWindow* window = (VirtWindow*)app->ardb->collection(VirtWindow::COLLECTION_NAME)->findOne(id);

      if (window == NULL) {
        // TODO - throw exception here
      }

      CreateWrtcConnectionResponse windowWrtcConnection(app);
      while(windowWrtcConnection.read());

      windowWrtcConnection.connection->setVideo(window);
      connection  = windowWrtcConnection.connection;
    }

    // TODO - return webrtc connection
    return new mesh::BufferedResponse<core::IJsonSerializable*>(connection);
  }

  /**
   */

  mesh::Response* Commands::execSetRemoteAnswer(mesh::Request* request, Application* app) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    Json::Value* data = (Json::Value*)request->data;
    WRTCConnection* connection = (WRTCConnection*)app->ardb->collection(WRTCConnection::COLLECTION_NAME)->findOne((*data)["query"]);

    if (connection == NULL) {
      LOG_ERROR("wrtc connection not found" << (*data));
      return NULL;
    }

    Json::Value& d = (*data)["answer"];

    connection->setRemoteDescription(wrtc::SessionDescription(d["type"].asString(), d["sdp"].asString()));

    // TODO - return webrtc connection
    return new mesh::BufferedResponse<core::IJsonSerializable*>(connection);
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

    Json::Value resp(Json::arrayValue);

    mesh::AsyncResponse* response = new mesh::AsyncResponse();

    for (int i = 0, n = results.size(); i < n; i++) {
      Json::Value v = results.at(i)->toJson();

      // TODO - memory leak here
      response->write(new core::JsonChunk(v));
    }

    response->end();

    return response;
  }
}