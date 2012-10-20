
#include "base/control/graphics.h"
#include "control/window.h"

namespace Control 
{	
	/**
	 */

	BaseWindow::BaseWindow()
	{
		this->_graphics = 0;
	}

	/**
	 */

	Geom::Rectangle BaseWindow::bounds()
	{
		Geom::Padding pad = this->padding();

		return Geom::Rectangle(pad.left, pad.top, pad.right - pad.left, pad.bottom - pad.top);
	}

	/**
	 */

	// universal across platforms
	WindowGraphics* BaseWindow::graphics()
	{
		if(this->_graphics == 0)
		{
			this->_graphics = new WindowGraphics(this);
		}	

		return this->_graphics;
	}


	
}
