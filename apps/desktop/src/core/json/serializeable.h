#ifndef JSON_SERIALIZABLE_H_
#define JSON_SERIALIZABLE_H_

#include <json/json.h>

namespace core {
  class IJsonSerializable {
  public:
    virtual Json::Value toJson()=0;
  };
}
#endif