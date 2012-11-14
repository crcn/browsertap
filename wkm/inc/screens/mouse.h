#ifndef _MOUSE_H_
#define _MOUSE_H_

namespace Screens 
{
	class Screen;

	class Mouse
	{
	public:
		Mouse(Screen* screen);
		bool event(int dwFlags, int x, int y, int dwData);
	private:
		Screen* _screen;
	};
}

#endif