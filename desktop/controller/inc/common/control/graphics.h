#ifndef CONTROL_GRAPHICS_H_
#define CONTROL_GRAPHICS_H_

#include "geom/rectangle.h"
#include "graphics/bitmap.h"

namespace Control 
{

	class Window;

	class WindowGraphics 
	{

	public:

		/**
		 */

		WindowGraphics(Window* target);

		/**
		 * prints the entire window
		 */

		Graphics::Bitmap* print();


		/**
		 * prints a cutout of the target window
		 */

		Graphics::Bitmap* print(Geom::Rectangle& bounds);

	private:

		Window* _window;

	};
}

#endif