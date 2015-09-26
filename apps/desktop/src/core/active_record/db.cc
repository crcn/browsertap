
#include "./db.h"

namespace activeRecord {
  DB::DB(base::Application* app):app(app) {
  }

  Collection* DB::collection(std::string name) {
    Collection* c = _sc[name];
    if (c != NULL) return c;
    c = _sc[name] = new Collection(name);
    c->addListener(this);
    return c;
  }

  void DB::handleEvent(core::Event* event) {
    Json::Value root;

    const char* name = NULL;

    root["collection"] = ((Collection*)event->currentTarget)->name;


    switch(event->type) {
      case ObjectEvent::INSERT:
        name = "insert";
        root["data"] = ((Object*)event->data)->toJSON();
        break;
      case ObjectEvent::REMOVE:
        name = "remove";
        root["query"]["id"] = ((Object*)event->target)->id();
        break;
      case ObjectEvent::UPDATE:
        name = "update";
        root["data"] = ((Object*)event->target)->toJSON();
        break;
    }

    // root["name"] = name;

    // // TODO - temporary - need to execute stuff here instead
    // Json::FastWriter writer;
    // std::cout << writer.write(root) << std::endl;

    mesh::Request request(name, &root);
    mesh::Response* resp = this->app->bus->execute(&request);
    while(resp->read());
    delete resp;
  }
}