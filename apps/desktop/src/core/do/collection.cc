#include "./collection.h"

namespace domain {
  Collection::Collection(std::string name):name(name) {

  }

  Object* Collection::insert(Object* object) {
    this->_objects.push_back(object);
    object->addListener(this);
    return object;
  }

  Object* Collection::remove(Object* object) {
    // TODO
    return object;
  }

  void Collection::handleEvent(core::Event* event) {
    // if (event->type == ObjectEvent.REMOVE) {
    //   // TODO 
    // }

    this->emit(event);
  }
}

