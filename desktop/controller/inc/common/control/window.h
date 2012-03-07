#ifndef CONTROL_WINDOW_
#define CONTROL_WINDOW_

#include "geom/rectangle.h"
#include "control/graphics.h"

namespace Control 
{
	class Window
	{
		public:

		/**
		 */

		Window();


		/**
		 * prints the window content
		 */

		WindowGraphics* graphics();


		/**
		 * the position of the window
		 */

		Geom::Rectangle& position();

		private:

		/**
		 * callled if graphics is not instantiated
		 */

		WindowGraphics* _newWindowGraphics();

		WindowGraphics* _graphics;
	};
}

#endif