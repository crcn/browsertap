#include "base/control/mouse.h"
#include <windows.h>

namespace Control
{
	void Mouse::setPosition(int x, int y)
	{
		_x = x;
		_y = y;

		//SetPhysicalCursorPos(x, y);
		dispatchEvent(MOUSEEVENTF_MOVE, x, y, 0);
	}

	void Mouse::dispatchEvent(int code, int x, int y, int dwData)
	{
		_x = x;
		_y = y;

		mouse_event(code, x, y, dwData, 0);

	}
	
	void Mouse::dispatchEvent(int code)
	{
		dispatchEvent(code, _x, _y, 0);
	}
}