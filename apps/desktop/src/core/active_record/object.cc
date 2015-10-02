#include "./object.h"

namespace activeRecord {

  Object::Object():core::EventEmitter() {
    _id = Object::_idCount++;
  }
  int Object::_idCount = 0;

  void Object::remove() {
    emit(ObjectEvent::REMOVE, NULL);
  }

  void Object::update() {
    emit(ObjectEvent::UPDATE, NULL);
  }

  int Object::id() {
    return _id;
  }

  Json::Value Object::toJson() {
    Json::Value root;
    root["id"] = _id;
    return root;
  }
}
