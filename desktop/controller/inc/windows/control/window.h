#ifndef CONTROL_WIN_WINDOW_
#define CONTROL_WIN_WINDOW_

#include <windows.h>
#include "base/control/window.h"

namespace Control
{
	class Window : public BaseWindow
	{

	public:

		/**
		 */

		Window(HWND target);


		/**
		 */

		void focus();



		/**
		 * the position of the window
		 */

		Geom::Padding padding(); 


		/**
		 */

		RECT getRect();

		/**
		 */

		HWND target();



	private:

		HWND _target;
	};
}

#endif