#ifndef _WWINDOW_W_
#define _WWINDOW_H_

#include <Windows.h>
#include <vector>
#include "common/events.h"
#include "common/geometry.h"
#include "process/process.h"

namespace Screens
{
	class BaseScreenController;
	class Screen;

	class ScreenEvent : public Events::Event
	{
	public:
		ScreenEvent(std::string type, Screen* screen);
		Screen* screen();
	private:
		Screen* _screen;
	};



	/**
	 * The physical window representation. It's also also an event dispatcher
	 * since it can fire events when shit happens ~ window closes, focus, etc.
	 */

	class Screen : public Events::EventDispatcher
	{
	private:

		/**
		 */

		BaseScreenController* _controller;

		/**
		 */

		Process::Process* _process;

		/**
		 */

		HWND _window;

		/**
		 */

		RECT getRect();

	public:

		/**
		 */

		Screen(HWND window, Process::Process* process);

		/**
		 * closes the window
		 */

		bool close();

		/**
		 */

		HWND target();
	
		/**
		 */

		BaseScreenController* controller();

		/**
		 * controls the window via commands
		 */

		void controller(BaseScreenController* controller);

		/**
		 */

		Geometry::Rectangle bounds();

		/**
		 */

		std::string title();

		/**
		 * moves the window
		 */

		bool resize(Geometry::Point value);

		/**
		 * moves the window
		 */

		bool resize(Geometry::Rectangle value);

		/**
		 */

		bool move(Geometry::Point value);

		/**
		 * focuses on the window - like a user click
		 */

		bool focus();

		/**
		 * returns TRUE if the window still exists - needed for the window manager
		 */

		bool exists();

		/**
		 */

		Process::Process* process();

		// std::vector<Screen*> children();
		// bool isChild(Screen* parent);

		/**
		 */

		// const char* title();
		~Screen();
	};

	/**
	 * controllers the window - records it, moves the mouse, etc. This can be
	 * a collection controller which is composed of multiple controllers. The controller
	 * receives commands by listening to events passed from a particular transport. 
	 * controllers might be: mouse, keyboard, printing, moving, etc.
	 */

	class BaseScreenController : public Events::BaseEventListener
	{
	private:

		/**
		 */

		Events::EventDispatcher* _commander;

	public:

		/**
		 * needs to set the screen itself
		 */

		friend class Screen;

		/**
		 */

		BaseScreenController();

		
		/**
		 * updates the controller - this is a next-tick sort of thing where something
		 * like broadcasting the window might occur 
		 */

		void update();

		/**
		 * the commander fires events which may control this controller
		 */

		void commander(Events::EventDispatcher* value);

		/**
		 * the screen THIS controller is controlling
		 */

		virtual void screen(Screen* value);


		/**
		 * used to attach to the commander
		 */

		virtual std::vector<std::string> events() = 0;


	protected:

		/**
		 */

		Screen* _screen;


	};


	/**
	 * manages all open windows
	 */

	class ScreenManager : public Events::EventDispatcher
	{

	public:

		/**
		 * check here if the singleton exists. If it does, tsk, tsk.
		 */

		ScreenManager();

		/**
		 * returns the singleton instance of the WindowManager
		 */

		static ScreenManager& instance()
		{
			static ScreenManager instance;
			return instance;
		}

		/**
		 * updates the window manager - this is a next-tick sort of thing
		 * that does house cleaning for all the windows
		 */

		void update();

	private:

		/**
		 */

		std::vector<Screen*> _screens;


		/**
		 * checks if windows are open. If they arent, the window reps get destroyed
		 */

		void removeClosedWindows();

		/**
		 */

		static BOOL CALLBACK eachWindow(HWND hWnd, LPARAM lParam);

		/**
		 */

		static Process::Process* findWindowProcess(HWND hWnd);

		/**
		 */

		ScreenManager(ScreenManager const&);

		/**
		 */

		void operator=(ScreenManager const&);

	};
}


#endif