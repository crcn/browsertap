#include "base/control/mouse.h"
#include <windows.h>
#include <iostream>

namespace Control
{

	void Mouse::dispatchEvent(int code, int x, int y, int dwData)
	{

		_x = (x*65535/GetSystemMetrics(SM_CXSCREEN));
		_y = (y*65535/GetSystemMetrics(SM_CYSCREEN));


		mouse_event(code, _x, _y, dwData, 0);

	}
	
	void Mouse::dispatchEvent(int code)
	{
		dispatchEvent(code, _x, _y, 0);
	}
}