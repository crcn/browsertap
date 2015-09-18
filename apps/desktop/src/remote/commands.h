#ifndef COMMANDERS_H_
#define COMMANDERS_H_

#include "common/events.h"
#include "screens/screens.h"
#include "json/reader.h"

namespace Commands
{
  class Command : public Events::EventDispatcher
  {
  public:
    virtual bool execute(JSON::Value& command) = 0;
    virtual void update() = 0;
  };
}

#endif