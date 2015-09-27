#ifndef JSON_CHUNK_H_
#define JSON_CHUNK_H_

#include "./serializeable.h"

namespace core {
  class JsonChunk : public IJsonSerializable {
  public:
    JsonChunk(Json::Value value):value(value) {
    }
    Json::Value toJson() {
      return this->value;
    }
  private:
    Json::Value value;
  };
}
#endif