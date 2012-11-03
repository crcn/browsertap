#ifndef _WWINDOW_W_
#defined _WWINDOW_H_

#include <vector>

namespace Windows
{
	class WindowController;

	class Window
	{
	private:

		/**
		 */

		WindowController* _controller;

	public:

		/**
		 * closes the window
		 */

		bool close():Boolean;
	
		/**
		 */

		WindowController* controller();

		/**
		 */

		void controller(WindowController* controller);

		/**
		 */

		bool focus();

		/**
		 * returns TRUE if the window still exists - needed for the window manager
		 */

		bool exists();


	}

	/**
	 * controllers the window - records it, moves the mouse, etc. This can be
	 * a collection controller which is composed of multiple controllers
	 */

	class WindowController
	{
	private:
		/**
		 * updates the controller - this is a next-tick sort of thing where something
		 * like broadcasting the window might occur 
		 */

		void update();
	}


	/**
	 * manages all open windows
	 */

	class WindowManager
	{
	private:

		/**
		 */

		static WindowManager* _instance;

		/**
		 */

		std::vector<Window*> _windows;

		/**
		 * checks if windows are open. If they arent, the window reps get destroyed
		 */

		void removeClosedWindows();

	public:

		/**
		 * check here if the singleton exists. If it does, tsk, tsk.
		 */

		WindowManager();

		/**
		 * returns the singleton instance of the WindowManager
		 */

		static WindowManager* instance();

		/**
		 * updates the window manager - this is a next-tick sort of thing
		 * that does house cleaning for all the windows
		 */

		void update();
	}
}


#endif