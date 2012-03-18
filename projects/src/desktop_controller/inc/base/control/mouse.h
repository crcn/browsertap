#ifndef MOUSE_H_
#define MOUSE_H_

#include "common/geom/point.h"

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


		/**
		 */

		void setPosition(int x, int y);

		/**
		 */

		void dispatchEvent(int code, int x, int y, int dwData);

		/**
		 */

		void dispatchEvent(int code);



	private:

		Geom::Point _offset;
		int _x, _y;



	};
}

#endif