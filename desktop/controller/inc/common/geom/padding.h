#ifndef GRAPHICS_PADDING_
#define GRAPHICS_PADDING_

namespace Geom 
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
}

#endif