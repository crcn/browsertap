#ifndef CLIENT_CONSOLE_
#define CLIENT_CONSOLE_

#include "control/window.h"
#include "base/control/mouse.h"
#include "base/control/keyboard.h"

namespace Client 
{
	class Console
	{

	public:

		/**
		 */

		Console(Control::Window* window, Control::Mouse* mouse, Control::Keyboard* keyboard);

		/**
		 */

		void start();


		/**
		 */

		void mouse(int x, int y, int dwData);

		/**
		 */

		void keyDown(int key);

		/**
		 */

		void keyUp(int key);


	private:

		/**
		 */

		Control::Window* _window;
		Control::Mouse* _mouse;
		Control::Keyboard* _keyboard;
	};
}

#endif