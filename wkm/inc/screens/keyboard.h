#ifndef _KEYBD_H
#define _KEYBD_H

namespace Screens 
{
	class Screen;

	class Keyboard
	{
	public:
		Keyboard(Screen* screen);
		bool event(int bvk, int bScan, int dwFlags);
	private:
		Screen* _screen;
	};
}

#endif