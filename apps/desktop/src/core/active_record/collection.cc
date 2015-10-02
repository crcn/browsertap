#include "./collection.h"
#include "../log/logger.h"

namespace activeRecord {

  Collection::Collection(std::string name):core::EventEmitter(), name(name) {
  }

  Object* Collection::insert(Object* object) {
    this->_objects.push_back(object);
    object->addListener(this);
    this->emit(ObjectEvent::INSERT, object);
    return object;
  }

  Object* Collection::remove(Object* object) {

    LOG_VERBOSE(__PRETTY_FUNCTION__);

    object->removeListener(this);

    std::vector<Object*>::iterator it = std::find(_objects.begin(), _objects.end(), object);
    if (it != _objects.end()) _objects.erase(it);

    return object;
  }

  std::vector<Object*> Collection::find(Json::Value query) {
    std::vector<Object*> ret;
    for(int i = 0, n = this->_objects.size(); i < n; i++) {
      Object* object = this->_objects.at(i);
      Json::Value objJson = object->toJson();
      if (this->_equals(objJson, query)) {
        ret.push_back(object);
      }
    }
    return ret;
  }

  Object* Collection::findOne(Json::Value query) {
    for(int i = 0, n = this->_objects.size(); i < n; i++) {
      Object* object = this->_objects.at(i);
      Json::Value objJson = object->toJson();
      if (this->_equals(objJson, query)) return object;
    }
    return NULL;
  }

  Object* Collection::findOne(int id) {
    for(int i = 0, n = this->_objects.size(); i < n; i++) {
      Object* object = this->_objects.at(i);
      if (object->id() == id) return object;
    }
    return NULL;
  }

  std::vector<Object*> Collection::all() {
    return this->_objects;
  }

  void Collection::handleEvent(core::Event* event) {

    if (event->type == ObjectEvent::REMOVE) {
      Object* activeRecord = (Object*)event->target;
      this->remove(activeRecord);
    }

    this->emit(event);
  }

  bool Collection::_equals(Json::Value object, Json::Value query) {

    for( Json::ValueIterator itr = query.begin() ; itr != query.end() ; itr++ ) {
      std::string key    = itr.key().asString();
      Json::Value qvalue = query[key];
      Json::Value ovalue = object[key];

      if (qvalue.isObject()) {
        if (!this->_equals(ovalue, qvalue)) return false;
      } else if (ovalue.compare(qvalue) != 0) {
        return false;
      }
    }

    return true;
  }
}
