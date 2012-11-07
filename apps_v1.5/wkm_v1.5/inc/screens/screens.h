#ifndef _WWINDOW_W_
#define _WWINDOW_H_

#include <Windows.h>
#include <vector>
#include "common/events.h"
#include "common/geometry.h"
#include "process/process.h"
#include "screens/recorder/recorder.h"

namespace Screens
{
	class Screen;

	/**
	 */

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

	public:

		/**
		 */

		Screen(HWND window, Process::Process* process);


		/**
		 */

		HWND target();

		/**
		 */

		int id();

		/**
		 */

		Geometry::Rectangle bounds();

		/**
		 */

		std::string title();

		/**
		 */

		std::string className();

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

		bool close();

		/**
		 */

		Process::Process* process();

		//TODO - isMaster
		// std::vector<Screen*> children();
		// bool isChild(Screen* parent);

		/**
		 */

		// const char* title();
		~Screen();

		/**
		 */

		Recorder* recorder();

		/**
		 */

		void update();

		/**
		 */

		void onProcessKill(Events::Event* event);


	private:


		static int _count;

		int _id;

		/**
		 */

		Process::Process* _process;

		/**
		 */

		HWND _window;

		/**
		 */

		RECT getRect();

		
		/**
		 * records this window
		 */

		Recorder* _recorder;

		/**
		 */

		void removeChrome();
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

		/**
		 */

		std::vector<Screen*> allScreens();

		/**
		 * does a check against all screens
		 */

		std::vector<Screen*> allOpenScreens();

		/**
		 */

		bool closeScreen(int id);

		/**
		 */

		Screen* getScreen(int id);

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