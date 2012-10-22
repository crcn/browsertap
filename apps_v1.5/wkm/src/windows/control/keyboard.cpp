#include "base/control/keyboard.h"
#include <windows.h>

namespace Control
{	
	/**
	 */

	Keyboard::Keyboard()
	{

	}
	
	/**
	 */

	void Keyboard::dispatchEvent(int code, int bScan, int dwFlags)
	{

		keybd_event(code, bScan, dwFlags, 0);
	}

	/**
	 */
	
	void Keyboard::keyDown(int key)
	{
		dispatchEvent(VK_NUMLOCK, key, KEYEVENTF_EXTENDEDKEY | 0);
	}

	/**
	 */
	
	void Keyboard::keyUp(int key)
	{
		dispatchEvent(VK_NUMLOCK, key, KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP);
	}
}