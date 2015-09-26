#include "./object.h"

namespace activeRecord {  

  Object::Object():core::EventEmitter() { }
  int Object::_idCount = 0;

  void Object::remove() {
    this->emit(ObjectEvent::REMOVE, NULL);
  }

  void Object::update() {
    this->emit(ObjectEvent::UPDATE, NULL);
  }

  int Object::id() {
    return _idCount++;
  }
}
