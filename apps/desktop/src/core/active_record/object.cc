#include "./object.h"
#include "./object_id.h"

namespace activeRecord {

  Object::Object():core::EventEmitter() {
    _id = generateUniqueId();
  }

  void Object::remove() {
    emit(ObjectEvent::REMOVE, NULL);
  }

  void Object::update() {
    emit(ObjectEvent::UPDATE, NULL);
  }

  std::string Object::id() {
    return _id;
  }

  Json::Value Object::toJson() {
    Json::Value root;
    root["_id"] = _id;
    return root;
  }
}
