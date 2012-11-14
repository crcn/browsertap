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


	LRESULT CALLBACK CallWndProc(int nCode, WPARAM wParam, LPARAM lParam)
	{
		std::cout << "OKAY" << std::endl;
		return CallNextHookEx(0, nCode, wParam, lParam);
	}


	/**
	 */

	Screen::Screen(HWND window, Process::Process* process):
	_parent(0),
	_process(process),
	_window(window),
	_recorder(0)
	{
		Screen::_count++;
		this->_id = Screen::_count;
		this->_mouse = new Mouse(this);
		this->_keyboard = new Keyboard(this);
		this->_style = GetWindowLong(this->_window, GWL_STYLE);
	}

	int Screen::_count = 0;

	std::string Screen::title()
	{
		char title[1024];
		GetWindowTextA(this->_window, title, sizeof(title));
		return title;
	}

	std::string Screen::className()
	{
		char className[1024];
		GetClassName(this->_window, className, sizeof(className));
		return className;
	}

	Mouse* Screen::mouse()
	{
		return this->_mouse;
	}

	Keyboard* Screen::keyboard()
	{
		return this->_keyboard;
	}

	bool Screen::focus()
	{
		return SetForegroundWindow(this->_window);
	}

	void Screen::removeChrome()
	{
		/*LONG lStyle = GetWindowLong(this->_window, GWL_STYLE);
		lStyle &= ~(WS_CAPTION | WS_THICKFRAME | WS_MINIMIZE | WS_MAXIMIZE | WS_SYSMENU);
		SetWindowLong(this->_window, GWL_STYLE, 0);
		SetWindowPos(this->_window, NULL, 0,0,0,0, SWP_FRAMECHANGED | SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_NOOWNERZORDER);*/
		// This will make a hole you can see through for the MainToon window.

		// HRGN rgnOriginalWnd;
		// HRGN rgnTheHole;
		HRGN rgnNewWnd;

		Geometry::Rectangle bounds = this->bounds();

		// rgnOriginalWnd = CreateRectRgn(0, 0, bounds.width, bounds.height);
		// rgnTheHole = CreateRectRgn(10, 200, 350, 450);
		rgnNewWnd = CreateRectRgn(3, 25, bounds.width - 6, bounds.height - 6);

		// CombineRgn(rgnNewWnd, rgnOriginalWnd, rgnTheHole, RGN_DIFF);
      	SetWindowRgn(this->_window, rgnNewWnd, TRUE);

		// DeleteObject(rgnOriginalWnd);
		// DeleteObject(rgnTheHole);
		DeleteObject(rgnNewWnd);
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

	int Screen::parent()
	{
		return this->_parent;
	}

	long Screen::style()
	{
		return this->_style;
	}

	Geometry::Rectangle Screen::bounds()
	{
		RECT rect = this->getRect();
		return Geometry::Rectangle(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
	}

	bool Screen::resize(Geometry::Rectangle bounds)
	{
		if(bounds.width == 0 || bounds.height == 0) return FALSE;


		// RECT rect;
		// GetWindowRect(this->_window, &rect);
		//http://stackoverflow.com/questions/2698113/is-there-a-way-to-change-the-maximum-width-of-a-window-without-using-the-wm-getm
		//http://forums.codeguru.com/showthread.php?486970-Catching-WM_GETMINMAXINFO-from-notepad.exe-doesn-t-work
		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633534(v=vs.85).aspx
		// return MoveWindow(this->_window, bounds.x, bounds.y, bounds.width, bounds.height, true);
		SetWindowPos(this->_window, NULL, 0, 0, bounds.width, bounds.height, SWP_NOMOVE | SWP_NOSENDCHANGING);
		// RedrawWindow(this->_window, NULL, NULL, RDW_INVALIDATE | RDW_ALLCHILDREN | RDW_ERASENOW | RDW_UPDATENOW);
		// InvalidateRect(this->_window, &rect, false);
		/*HRGN rgnNewWnd; 


		// rgnOriginalWnd = CreateRectRgn(0, 0, bounds.width, bounds.height);
		// rgnTheHole = CreateRectRgn(10, 200, 350, 450);
		rgnNewWnd = CreateRectRgn(0, 0, bounds.width, bounds.height);

		// CombineRgn(rgnNewWnd, rgnOriginalWnd, rgnTheHole, RGN_DIFF);
      	SetWindowRgn(this->_window, rgnNewWnd, TRUE);

		DeleteObject(rgnNewWnd);
		this->focus();*/
		return true;
	}

	bool Screen::resize(Geometry::Point point)
	{
		Geometry::Rectangle bounds = this->bounds();
		return this->resize(Geometry::Rectangle(bounds.x, bounds.y, point.x, point.y));
	}

	bool Screen::move(Geometry::Point point)
	{
		SetWindowPos(this->_window, NULL, point.x, point.y, 200, 200, SWP_NOSIZE | SWP_NOSENDCHANGING);
		return true;
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
		delete this->_mouse;
		delete this->_keyboard;
		this->dispatchEvent(new ScreenEvent(Events::Event::CLOSE, this));
	}


	/**
	 */

	ScreenManager::ScreenManager()
	{
		//no bueno.
		/*std::cout << "OK" << std::endl;
		RECT rct;
		rct.left = -1000;
		rct.right = 1000;
		rct.top = -1000;
		rct.bottom = 1000;

		if(!SystemParametersInfo(SPI_SETWORKAREA, 0, (LPVOID)&rct, SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE)) {
			std::cout << "FAIL" << std::endl;
			std::cout << GetLastError() << std::endl;
		}*/

		/*HHOOK hook = SetWindowsHookEx(WH_CALLWNDPROC, CallWndProc, GetModuleHandle(NULL), NULL);
		MSG message;
		while(GetMessage(&message, NULL, 0, 0)) {
			TranslateMessage(&message);
			DispatchMessage(&message);
		}*/

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
		this->updateRelationships();
		this->dispatchNewScreens();
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
			sm->_newScreens.push_back(screen);
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

	void ScreenManager::updateRelationships()
	{
		int n = this->_screens.size();

		/*for(int i = n; i--;)
		{
			Screen* child = this->_screens.at(i);
			int pid = (int)GetParent(child->_window);

			for(int j = n; j--;)
			{
				Screen* parent = this->_screens.at(j);

				if((int)(parent->_window) == pid) {
					child->_parent = parent->id();
					break;
				}
			}
		}*/
	}


	void ScreenManager::dispatchNewScreens()
	{
		for(int i = this->_newScreens.size(); i--;)
		{
			this->dispatchEvent(new ScreenEvent(Events::Event::OPEN, this->_newScreens.at(i)));
		}

		this->_newScreens.clear();
	}

}