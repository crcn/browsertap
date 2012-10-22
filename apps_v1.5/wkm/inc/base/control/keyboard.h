#ifndef KEYBOARD_H_
#define KEYBOARD_H_

#include "common/geom/point.h"

namespace Control
{

	/**
	 */

	class Keyboard 
	{


	public:

		/**
		 */

		Keyboard();

		/**
		 */

		void dispatchEvent(int code, int bScan, int dwFlags);

		/**
		 */

		void keyDown(int key);

		/**
		 */

		void keyUp(int key);



	private:

		Geom::Point _offset;


	};
}

#endif