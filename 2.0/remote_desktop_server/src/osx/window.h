//
//  OSXScreen.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__OSXScreen__
#define __RemoteDesktop__OSXScreen__

#include <stdio.h>
#include <ApplicationServices/ApplicationServices.h>

#include "../base/window.h"
#include "../geom/bounds.h"

namespace osx {
  class Window : base::Window {
  private:
      CFDictionaryRef _info;
      geom::Bounds _bounds;

  public:
      Window(CFDictionaryRef info);
      geom::Bounds bounds();
      void bounds(geom::Bounds bounds);
  };
}

#endif /* defined(__RemoteDesktop__OSXScreen__) */
