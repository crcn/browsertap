#include "screens/keyboard.h"
#include "screens/screens.h"

namespace Screens
{
	Keyboard::Keyboard(Screen* screen):
	_screen(screen)
	{

	}

	bool Keyboard::event(int bvk, int bScan, int dwFlags)
	{

		//this->_screen->focus();

		keybd_event(bvk, bScan, dwFlags, 0);

		return true;
	}
}