#include "./object.h"

namespace domain {  

  Object::Object():core::EventEmitter() { }

  void Object::remove() {
    this->emit(ObjectEvent::REMOVE, NULL);
  }

  void Object::update() {
    this->emit(ObjectEvent::UPDATE, NULL);
  }

  int Object::id() {
    return 0;
  }
}
