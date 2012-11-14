#ifndef GRAPHICS_H_
#define GRAPHICS_H_

#include "common/geometry.h"

namespace Graphics
{
	class Bitmap 
	{


	public:

		/**
		 */

		Bitmap(const char *buffer, Geometry::Rectangle& bounds);

		/**
		 */

		const char *buffer();

		/**
		 */

		Geometry::Rectangle &bounds();

		/**
		 */

		~Bitmap();

	private:

		const char *_buffer;
		Geometry::Rectangle _bounds;
	};
}

#endif