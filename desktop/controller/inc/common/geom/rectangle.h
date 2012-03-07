#ifndef GRAPHICS_RECTANGLE_H_
#define GRAPHICS_RECTANGLE_H_

namespace Geom {

	class Rectangle {

	public:

		/**
		 */

		int x, y, width, height;

		/**
		 */

		Rectangle(int x, int y, int width, int height);


		/**
		 */

		Rectangle(int width, int height);

		/**
		 */

		Rectangle();
	};
}

#endif