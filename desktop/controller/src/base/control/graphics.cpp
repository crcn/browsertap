
#include "base/control/graphics.h"
#include "control/window.h"

namespace Control 
{
	/**
	 */

	WindowGraphics::WindowGraphics(BaseWindow* target)
	{
		this->_window = target;
	}

	/**
	 * prints the entire window
	 */

	Graphics::Bitmap* WindowGraphics::print()
	{
		return this->print(Geom::Padding());
	}

}
