#include "screens/screens.h"
#include "process/process.h"

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

	Screen::Screen(HWND window, Process::Process* process)
	:_controller(0),
	_process(process),
	_window(window)
	{
	}

	bool Screen::close()
	{
		return FALSE;
	}

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

	bool Screen::exists()
	{
		return IsWindow(this->_window);
	}

	HWND Screen::target()
	{
		return this->_window;
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

	RECT Screen::getRect()
	{
		RECT rect;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633519(v=vs.85).aspx
		GetWindowRect(this->_window, &rect);
		return rect;
	}

	BaseScreenController* Screen::controller()
	{
		return this->_controller;
	}

	void Screen::controller(BaseScreenController* value)
	{
		this->_controller = value;
		value->screen(this);
	}

	Process::Process* Screen::process()
	{
		return this->_process;
	}

	Screen::~Screen()
	{
		this->dispatchEvent(new ScreenEvent(Events::Event::CLOSE, this));
	}

	/**
	 */

	BaseScreenController::BaseScreenController() 
	{
		this->_screen = NULL;
	}

	void BaseScreenController::update() 
	{
		//do nothing
	}

	void BaseScreenController::screen(Screen* value) 
	{
		this->_screen = value;
	}

	void BaseScreenController::commander(Events::EventDispatcher* value)
	{
		this->_commander = value;

		//fetch the events so we can attach them to the window
		std::vector<std::string> events = this->events();

		//attach the events to the window here - could be MOUSE_MOVE, 
		for(int i = events.size(); i--;) 
		{
			value->addEventListener(events.at(i), this);
		}
	}

	/**
	 */

	ScreenManager::ScreenManager()
	{

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
			std::cout << "open window " << screen->title() << std::endl;
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
				std::cout << "close window " << screen->title() << std::endl;
				delete screen;
				this->dispatchEvent(new ScreenEvent(Events::Event::CLOSE, screen));
			}
		}
	}
}