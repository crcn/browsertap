//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_OSXSystem_h
#define RemoteDesktop_OSXSystem_h

#include "../base/system.h"
#include <ApplicationServices/ApplicationServices.h>

namespace osx {
  class System : base::System {
  public:
      virtual base::Window* getWindows();
  };
}
#endif
