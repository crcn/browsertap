#include "control/graphics.h"


namespace Control 
{
	/**
	 */

	WindowGraphics::WindowGraphics(Window* target)
	{
		this->_window = target;
	}

	/**
	 */

	Graphics::Bitmap* WindowGraphics::print() 
	{
		return 0;
	}

	/**
	 */
	
	Graphics::Bitmap* WindowGraphics::print(Geom::Rectangle& rect)
	{
		return 0;
	}
}