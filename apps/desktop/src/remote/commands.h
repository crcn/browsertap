#ifndef COMMANDERS_H_
#define COMMANDERS_H_

#include <json/json.h>

namespace remote
{
  class Commands
  {
  public:
    bool execute(Json::Value& command);
  };
}

#endif