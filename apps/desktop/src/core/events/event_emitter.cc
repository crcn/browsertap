#include "./event_emitter.h"
#include <iostream>

void core::EventEmitter::emit(int type = 0, void* data = NULL) {
  emit(new Event(type, data));
}

void core::EventEmitter::emit(Event* event) {
  for (int i = 0, n = _listeners.size(); i < n; i++) {
    _listeners.at(i)->handleEvent(event);
  }
}

void core::EventEmitter::addListener(EventListener* listener) {
  _listeners.push_back(listener);
}
