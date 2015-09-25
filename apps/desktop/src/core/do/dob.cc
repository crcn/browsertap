
#include "./dob.h"

namespace app {
  DomainObjectBase::DomainObjectBase(base::Application* bus):app(app) {

  }

  domain::Collection* DomainObjectBase::collection(std::string name) {
    domain::Collection* c = _sc[name];
    if (c != NULL) return c;
    c = _sc[name] = new domain::Collection(name);
    c->addListener(this);
    return c;
  }

  void DomainObjectBase::handleEvent(core::Event* event) {
    // TODO WITH CURRENT TARGET
    LOG_NOTICE("handle domain object event");
    Json::Value root;

    const char* name = NULL;

    root["collection"] = ((domain::Collection*)event->currentTarget)->name;

    switch(event->type) {
      case domain::ObjectEvent::INSERT:
        name = "insert";
        root["data"] = ((domain::Object*)event->target)->toJSON();
        break;
      case domain::ObjectEvent::REMOVE:
        name = "remove";
        root["query"]["id"] = ((domain::Object*)event->target)->id();
        break;
      case domain::ObjectEvent::UPDATE:
        name = "update";
        root["data"] = ((domain::Object*)event->target)->toJSON();
        break;
    }

    this->app->bus->execute(new mesh::Request(name, &root));
  }
}