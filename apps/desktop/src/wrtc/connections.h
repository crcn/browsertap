#ifndef WRTC_CONNECTIONS_H_
#define WRTC_CONNECTIONS_H_

#include "./connection.h"

namespace wrtc {
  class Connections {
  public:
    Connections();
    Connection* create();
  };
}

#endif