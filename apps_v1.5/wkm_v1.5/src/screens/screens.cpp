#include "screens/screens.h"
#include "process/process.h"
#include "screens/recorder/recorder.h"

namespace Screens 
{


	ScreenEvent::ScreenEvent(std::string type, Screen* screen):
	Events::Event::Event(type),
	_screen(screen)
	{

	}

	Screen* ScreenEvent::screen()
	{
		return this->_screen;
	}

	/**
	 */

	Screen::Screen(HWND window, Process::Process* process):
	_process(process),
	_window(window),
	_recorder(0)
	{
		Screen::_count++;
		this->_id = Screen::_count;
	}

	int Screen::_count = 0;

	std::string Screen::title()
	{
		char title[1024];
		GetWindowTextA(this->_window, title, sizeof(title));
		return title;
	}

	bool Screen::focus()
	{
		return SetForegroundWindow(this->_window);
	}


	Recorder* Screen::recorder()
	{
		if(this->_recorder == 0)
		{
			this->_recorder = new Recorder(this);
		}

		return this->_recorder;
	}

	bool Screen::close()
	{
		//does not work - returns unauthorized error - here for reference
		// DestroyWindow(this->_window);
		return PostMessage(this->_window, WM_CLOSE, 0, 0);
	}

	bool Screen::exists()
	{
		bool exists = IsWindow(this->_window);
		if(!exists) this->_process = 0;
		return exists;
	}

	HWND Screen::target()
	{
		return this->_window;
	}

	int Screen::id()
	{
		return this->_id;
	}

	Geometry::Rectangle Screen::bounds()
	{
		RECT rect = this->getRect();
		return Geometry::Rectangle(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
	}

	bool Screen::resize(Geometry::Rectangle bounds)
	{
		if(bounds.width == 0 || bounds.height == 0) return FALSE;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633534(v=vs.85).aspx
		return MoveWindow(this->_window, bounds.x, bounds.y, bounds.width, bounds.height, true);
	}

	bool Screen::resize(Geometry::Point point)
	{
		Geometry::Rectangle bounds = this->bounds();
		return this->resize(Geometry::Rectangle(bounds.x, bounds.y, point.x, point.y));
	}

	bool Screen::move(Geometry::Point point)
	{
		Geometry::Rectangle bounds = this->bounds();
		return this->resize(Geometry::Rectangle(point.x, point.y, bounds.width, bounds.height));
	}

	RECT Screen::getRect()
	{
		RECT rect;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633519(v=vs.85).aspx
		GetWindowRect(this->_window, &rect);
		return rect;
	}

	Process::Process* Screen::process()
	{
		return this->_process;
	}

	void Screen::update()
	{
		if(this->_recorder != 0)
		{
			this->_recorder->update();
		}
	}

	Screen::~Screen()
	{
		if(this->_recorder != 0) delete this->_recorder;
		this->dispatchEvent(new ScreenEvent(Events::Event::CLOSE, this));
	}

	/**
	 */

	ScreenManager::ScreenManager()
	{
		//this will ALWAYS be in index 0
		this->_screens.push_back(new Screen(GetDesktopWindow(), NULL));
	}

	std::vector<Screen*> ScreenManager::allScreens()
	{
		return this->_screens;
	}

	std::vector<Screen*> ScreenManager::allOpenScreens()
	{
		for(int i = this->_screens.size(); i--;)
		{
			Screen* screen = this->_screens.at(i);

			if(!screen->exists())
			{
				this->update();
				return this->allOpenScreens();
			}
		}

		return this->_screens;
	}

	bool ScreenManager::closeScreen(int id)
	{
		Screen* screen = this->getScreen(id);

		if(screen != 0)
		{
			bool success = screen->close();
			this->update();
			return success;
		}

		return false;
	}

	Screen* ScreenManager::getScreen(int id)
	{
		for(int i = this->_screens.size(); i--;)
		{
			Screen* screen = this->_screens.at(i);

			if(screen->id() == id) 
			{
				return screen;
			}
		}

		return 0;
	}

	void ScreenManager::update()
	{
		Process::ProcessManager::instance().update();
		this->removeClosedWindows();
		EnumWindows(eachWindow, (LPARAM)this);
	}

	BOOL CALLBACK ScreenManager::eachWindow(HWND hWnd, LPARAM lParam)
	{
		ScreenManager* sm = (ScreenManager*)lParam;
		if(!IsWindowVisible(hWnd)) return TRUE;

		int len = GetWindowTextLength(hWnd);
		if(len == 0) return TRUE;

		bool isNew = true;

		for(int i = sm->_screens.size(); i--;) 
		{
			Screen* screen = sm->_screens.at(i);
			if(screen->target() == hWnd) 
			{
				isNew = false;
			}
		}

		if(isNew) 
		{
			Process::Process* winProc = ScreenManager::findWindowProcess(hWnd);

			if(winProc == 0) 
			{
				std::cerr << "window does NOT have a process - this is a BUG!" << std::endl;
				return TRUE;
			}

			Screen* screen = new Screen(hWnd, winProc);
			sm->_screens.push_back(screen);
			sm->dispatchEvent(new ScreenEvent(Events::Event::OPEN, screen));
		}

		return TRUE;
	}

	Process::Process* ScreenManager::findWindowProcess(HWND hWnd)
	{
		DWORD pid;
		GetWindowThreadProcessId(hWnd, &pid);
		return Process::ProcessManager::instance().findProcessById(pid);
	}

	void ScreenManager::removeClosedWindows()
	{
		for(int i = this->_screens.size(); i--;)
		{
			Screen* screen = this->_screens.at(i);
			if(!screen->exists())
			{
				this->_screens.erase(this->_screens.begin() + i);
				this->dispatchEvent(new ScreenEvent(Events::Event::CLOSE, screen));
				delete screen;
			}
		}
	}

}