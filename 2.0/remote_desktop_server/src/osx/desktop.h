//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_OSXSystem_h
#define RemoteDesktop_OSXSystem_h

#include "../base/desktop.h"
#include <ApplicationServices/ApplicationServices.h>

namespace osx {
  class Desktop : public base::Desktop {
  private:
      std::vector<base::Window*> _windows;
  public:
      virtual std::vector<base::Window*> windows();
  };
}
#endif
