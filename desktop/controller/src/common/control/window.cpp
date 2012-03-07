#include "control/window.h"

namespace Control
{

	/**
	 */

	Window::Window() 
	{
		this->_graphics = 0;
	}

	/**
	 */

	WindowGraphics* Window::graphics()
	{
		if(this->_graphics == 0)
		{
			this->_graphics = this->_newWindowGraphics();
		}

		return this->_graphics;
	}

	/**
	 */

	WindowGraphics* Window::_newWindowGraphics()
	{
		return 0;
	}
}