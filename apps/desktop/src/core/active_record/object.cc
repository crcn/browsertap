#include "./object.h"

namespace activeRecord {  

  Object::Object():core::EventEmitter() {
    this->_id = Object::_idCount++;
  }
  int Object::_idCount = 0;

  void Object::remove() {
    this->emit(ObjectEvent::REMOVE, NULL);
  }

  void Object::update() {
    this->emit(ObjectEvent::UPDATE, NULL);
  }

  int Object::id() {
    return this->_id;
  }

  Json::Value Object::toJson() {
    Json::Value root;
    root["id"] = this->_id;
    return root;
  }
}
