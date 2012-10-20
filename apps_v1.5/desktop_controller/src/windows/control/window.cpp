#include "windows/control/window.h"
#include "common/geom/padding.h"

namespace Control
{

	Window::Window(HWND target):
	BaseWindow()
	{
		this->_target = target;
	}


	void Window::focus()
	{
		SetForegroundWindow(this->_target);
	}

	Geom::Padding Window::padding()
	{
		RECT rect = this->getRect();
		return Geom::Padding(rect.left, rect.right, rect.top, rect.bottom);
	}



	Window* Windows::desktop() 
	{
		return new Window(GetDesktopWindow());
	}

	/**
	 */

	HWND Window::target()
	{
		return this->_target;
	}


	/**
	 */

	RECT Window::getRect()
	{
		RECT rect;
		GetWindowRect(this->_target, &rect);
		return rect;
	}

}