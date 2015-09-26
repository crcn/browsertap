//
//  bounds.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __GRAPHICS_PRINTABLE_H_
#define __GRAPHICS_PRINTABLE_H_

#include <stdio.h>
#include "./bitmap.h"

namespace graphics {
    class Printable {
    public:
      virtual Bitmap* print()=0;
      ~Printable() { }
    };
};

#endif
