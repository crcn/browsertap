#ifndef GEOM_H_
#define GEOM_H_

namespace Geometry
{
	class Padding
	{

	public:

		/**
		 */

		int left, right, top, bottom;

		/**
		 */

		Padding(int left, int right, int top, int bottom);

		/**
		 */

		Padding();
	};

	class Point 
	{

	public:

		/**
		 */

		int x, y;

		/**
		 */

		Point(int x, int y);

		/**
		 */

		Point();
	};

	class Rectangle 
	{

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

		/**
		 */

		bool equals(Rectangle* rect);


		/**
		 */

		bool resize(Rectangle* rect);
	};
}
#endif