#include "screens/mouse.h"
#include "screens/screens.h"

namespace Screens
{
	Mouse::Mouse(Screen* screen):
	_screen(screen),
	_freezeX(0),
	_freezeY(0)
	{
	}

	bool Mouse::event(int dwFlags, int x, int y, int dwData)
	{
		int mouseX = 100;
		int mouseY = 100;
		int rmx = 100;
		int rmy = 100;
		int x2 = 0;
		int y2 = 0;



		// std::cout << x2 << " " << y2 << " " << GetSystemMetrics(SM_CXSCREEN) << std::endl;
		if(!this->_screen->inFocus())
			this->_screen->focus();
		// this->inFocus = true;


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

		

		/*if(this->_screen->rightClickDown && (dwFlags & MOUSEEVENTF_LEFTDOWN)) {
			this->_screen->rightClickDown = false;
			this->_freezeX = 0;
			this->_freezeY = 0;
		} else 
		if(dwFlags & MOUSEEVENTF_RIGHTDOWN) {
			this->_screen->rightClickDown = true;
			this->_freezeX = x;
			this->_freezeY = y;
			moveWindow = true;
		}*/

		if(this->_freezeX > 0) {
			rmx = x - this->_freezeX + mouseX;
			rmy = y - this->_freezeY + mouseY;
		} else {
			rmx = mouseX;
			rmy = mouseY;
		}

		rmx = x;
		rmy = y;

		x2 = (rmx * 65535/GetSystemMetrics(SM_CXSCREEN));
		y2 = (rmy * 65535/GetSystemMetrics(SM_CYSCREEN));

		// realX = x - rmx;
		// realY = y - rmy;


		/*if(!this->_screen->rightClickDown || moveWindow) {
			// this->_screen->move(Geometry::Point(0, 0));
		}*/

		mouse_event(dwFlags, x2, y2, dwData, 0);


		// SetCursorPos(x, y);
		// std::cout << realX << " " << realY << std::endl;

		//move the WINDOW instead of the mouse to bypass mouse bounds

		return true;
	}
}