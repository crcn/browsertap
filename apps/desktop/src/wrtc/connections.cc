#include "./connections.h"

namespace wrtc {
  Connections::Connections() {

  }

  Connection* Connections::create() {
    return new Connection(NULL);
  }
}