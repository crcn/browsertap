#ifndef GRAPHICS_BITMAP_H_
#define GRAPHICS_BITMAP_H_

#include "common/geom/rectangle.h"


namespace Graphics 
{

	class Bitmap 
	{


	public:

		/**
		 */

		Bitmap(const char *buffer, Geom::Rectangle& bounds);

		/**
		 */

		const char *buffer();

		/**
		 */

		Geom::Rectangle &bounds();

	private:

		const char *_buffer;
		Geom::Rectangle _bounds;
	};
}


#endif