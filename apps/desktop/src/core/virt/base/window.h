//
//  Screen.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_BaseWindow_h
#define RemoteDesktop_BaseWindow_h

#include "../../geom/bounds.h"
#include "../../events/event_emitter.h"
#include "../../graphics/printable.h"
#include <iostream>

namespace virt {

  enum WindowEvents {
    REMOVE
  };

  class Window : public graphics::Printable, public core::EventEmitter {
  public:
      virtual geom::Bounds bounds()=0;
      virtual void bounds(geom::Bounds bounds)=0;
      virtual graphics::Bitmap* print()=0;
      virtual std::string title()=0;
      virtual bool isMinimized()=0;
      virtual ~Window(){ };
  };
}

#endif
