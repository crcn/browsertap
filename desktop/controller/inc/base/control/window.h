#ifndef CONTROL_WINDOW_
#define CONTROL_WINDOW_

#include "common/geom/padding.h"
#include "common/geom/rectangle.h"
#include "base/control/graphics.h"

namespace Control 
{
	class Window;
	

	/**
	 */

	class BaseWindow
	{
		public:

		/**
		 */

		BaseWindow();

		/**
		 */

		WindowGraphics* graphics();

		/**
		 */

		Geom::Rectangle bounds();

		/**
		 */

		virtual void focus() = 0;


		/**
		 */

		virtual Geom::Padding padding() = 0;



		protected:

		/**
		 */

		WindowGraphics* _graphics;
	};




	class Windows 
	{
	public:
		/**
		 * returns the desktop window
		 */

		static Window* desktop();

		//TODO
		//Window[] find(const char* name);

		//WIndow[] findOne(const char* name);
	};
}

#endif