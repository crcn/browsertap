#include "screens/mouse.h"
#include "screens/screens.h"

namespace Screens
{
	Mouse::Mouse(Screen* screen):
	_screen(screen)
	{

	}

	bool Mouse::event(int dwFlags, int x, int y, int dwData)
	{
		Geometry::Rectangle bounds = this->_screen->bounds();

		int x2 = ((bounds.x + x) * 65535/GetSystemMetrics(SM_CXSCREEN));
		int y2 = ((bounds.y + y) * 65535/GetSystemMetrics(SM_CYSCREEN));

		this->_screen->focus();

		/*DWORD dw = MAKEWORD(x2, y2);
		HWND target = this->_screen->target();

		int msg = 0;
		int wparam = 0;
		int lparam = dw;

		if(dwFlags & MOUSEEVENTF_LEFTDOWN) {
			msg = WM_LBUTTONDOWN;
			wparam = MK_LBUTTON;
		}
		else
		if(dwFlags & MOUSEEVENTF_RIGHTDOWN) {
			msg = WM_RBUTTONDOWN;
			wparam = MK_RBUTTON;
		}
		else 
		if(dwFlags & MOUSEEVENTF_LEFTUP) {
			msg = WM_LBUTTONUP;
			wparam = MK_LBUTTON;
		}
		else 
		if(dwFlags & MOUSEEVENTF_RIGHTUP) {
			msg = WM_LBUTTONUP;
			wparam = MK_RBUTTON;
		}
		else
		if(dwFlags & MOUSEEVENTF_MOVE) {
			msg = WM_MOUSEMOVE;
			wparam = 0;
		}

		std::cout << msg << " " << wparam << " " << lparam << std::endl;

		PostMessage(target, msg, wparam, lparam);*/
		mouse_event(dwFlags, x2, y2, dwData, 0);

		return true;
	}
}