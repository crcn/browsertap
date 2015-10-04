//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__WinSystem__
#define __RemoteDesktop__WinSystem__

#include <vector>
#include "../base/desktop.h"
#include "./window.h"

namespace win32 {
  class Desktop : public virt::Desktop  {
  public:
      virtual std::vector<virt::Window*> syncWindows() {
        std::vector<virt::Window*> wins;
        return wins;
      }
  };
};


#endif /* defined(__RemoteDesktop__OSXSystem__) */
