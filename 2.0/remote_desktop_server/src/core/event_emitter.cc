#include "./event_emitter.h"

void core::EventEmitter::emit(int type = 0) {
  emit(new Event(type));
}

void core::EventEmitter::emit(Event* event) {
  for (int i = _listeners.size(); i >= 0; i--) {
    _listeners.at(i)->handleEvent(event);
  }
}

void core::EventEmitter::addListener(EventListener* listener) {
  _listeners.push_back(listener);
}
