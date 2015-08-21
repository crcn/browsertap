//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__OSXSystem__
#define __RemoteDesktop__OSXSystem__

#include <vector>
#include "./window.h"

namespace base {
  class Desktop {
  public:
      virtual std::vector<base::Window*> windows()=0;
  };
};


#endif /* defined(__RemoteDesktop__OSXSystem__) */