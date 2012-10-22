#ifndef CLIENT_CONSOLE_
#define CLIENT_CONSOLE_

#include "control/window.h"
#include "base/control/mouse.h"
#include "base/control/keyboard.h"
#include "common/broadcast/ffmpeg.h"

namespace Client 
{
	class Console
	{

	public:

		/**
		 */

		Console(Control::Window* window, 
			Broadcast::FFMPeg* broadcaster, 
			Control::Mouse* mouse, 
			Control::Keyboard* keyboard);

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


		/**
		 */

		Broadcast::FFMPeg* mediaBroadcaster();


		/**
		 */

		Control::Window* window();


		Geom::Padding padding;
		Geom::Rectangle bounds;


	private:

		/**
		 */

		Control::Window* _window;
		Control::Mouse* _mouse;
		Control::Keyboard* _keyboard;
		Broadcast::FFMPeg* _mediaBroadcaster;
	};
}

#endif