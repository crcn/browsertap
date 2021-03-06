#include "./event_emitter.h"
#include <iostream>

namespace core {

  EventEmitter::EventEmitter() {

  }

  void EventEmitter::emit(int type = 0, void* data = NULL) {
    Event event(type, data);
    emit(&event);
  }

  void EventEmitter::emit(Event* event) {

    if (event->target == NULL) {
      event->target = this;
    }

    event->currentTarget = this;

    for (int i = _listeners.size() - 1; i >= 0; i--) {
      _listeners.at(i)->handleEvent(event);
    }
  }

  void EventEmitter::addListener(EventListener* listener) {
    _listeners.push_back(listener);
  }


  void EventEmitter::removeListener(EventListener* listener) {    std::vector<EventListener*>::iterator it = std::find(_listeners.begin(), _listeners.end(), listener);
    if (it != _listeners.end()) _listeners.erase(it);
  }
}
