#include "screens/screens.h"

namespace Screens 
{

	/**
	 */

	Screen::Screen(HWND window)
	:_controller(0)
	{
		this->_window = window;
	}

	bool Screen::close()
	{
		return FALSE;
	}

	bool Screen::focus()
	{
		return SetForegroundWindow(this->_window);
	}

	bool Screen::exists()
	{
		return FALSE;
	}

	HWND Screen::target()
	{
		return this->_window;
	}

	Geometry::Rectangle Screen::bounds()
	{
		RECT rect = this->getRect();
		return Geometry::Rectangle(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
	}

	bool Screen::resize(Geometry::Rectangle bounds)
	{
		if(bounds.width == 0 || bounds.height == 0) return FALSE;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633534(v=vs.85).aspx
		return MoveWindow(this->_window, bounds.x, bounds.y, bounds.width, bounds.height, true);
	}

	RECT Screen::getRect()
	{
		RECT rect;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633519(v=vs.85).aspx
		GetWindowRect(this->_window, &rect);
		return rect;
	}

	BaseScreenController* Screen::controller()
	{
		return this->_controller;
	}

	void Screen::controller(BaseScreenController* value)
	{
		this->_controller = value;
		value->screen(this);
	}

	/**
	 */

	BaseScreenController::BaseScreenController() 
	{
		this->_screen = NULL;
	}

	void BaseScreenController::update() 
	{
		//do nothing
	}

	void BaseScreenController::screen(Screen* value) 
	{
		this->_screen = value;
	}

	void BaseScreenController::commander(Events::EventDispatcher* value)
	{
		this->_commander = value;

		//fetch the events so we can attach them to the window
		std::vector<std::string> events = this->events();

		//attach the events to the window here - could be MOUSE_MOVE, 
		for(int i = events.size(); i--;) 
		{
			value->addEventListener(events.at(i), this);
		}
	}
}