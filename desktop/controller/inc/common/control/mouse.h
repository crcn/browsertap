#ifndef MOUSE_H_
#define MOUSE_H_

#include "geom/point.h"

namespace Control
{
	class Mouse 
	{


	public:

		/**
		 */

		Mouse();


		/**
		 * sets the offset of the given mouse - useful
		 * incase part of the desktop
		 */

		Geom::Point& offset();

		/**
		 */

		void offset(Geom::Point newOffset);




	private:

		Geom::Point _offset;



	};
}

#endif