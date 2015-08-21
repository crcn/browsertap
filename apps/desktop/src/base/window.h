//
//  Screen.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_BaseWindow_h
#define RemoteDesktop_BaseWindow_h

#include "../geom/bounds.h"
#include "../graphics/bitmap.h"

namespace base {
  class Window {
  public:
      virtual geom::Bounds bounds()=0;
      virtual void bounds(geom::Bounds bounds)=0;
      virtual graphics::Bitmap* print()=0;
  };
}

#endif
