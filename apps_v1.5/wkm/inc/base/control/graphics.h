#ifndef CONTROL_GRAPHICS_H_
#define CONTROL_GRAPHICS_H_

#include "common/geom/padding.h"
#include "common/geom/rectangle.h"
#include "common/graphics/bitmap.h"

namespace Control 
{
	class BaseWindow;

	class WindowGraphics 
	{

	public:

		/**
		 */

		WindowGraphics(BaseWindow* target);

		/**
		 * prints the entire window
		 */

		Graphics::Bitmap* print();


		/**
		 * prints a cutout of the target window
		 */

		Graphics::Bitmap* print(Geom::Padding padding, Geom::Rectangle bounds);

		/**
		 */

		Graphics::Bitmap* print(Geom::Padding padding);
		



	private:

		BaseWindow* _window;

	};
}

#endif