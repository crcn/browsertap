
#define WINVER 0x0500
#include <string>
#include <Windows.h>
#include <iostream>
#include <stdlib.h>
#include "psapi.h"
#include "common/events.h"
#include "screens/screens.h"

void handleEvent(Events::Event* event)
{
	Screens::ScreenEvent* ev = (Screens::ScreenEvent*)event;

	std::cout << ev->screen()->title() << " - " << ev->screen()->process()->path() << std::endl;

	for(int i = 100; i--;) 
	{
		ev->screen()->move(Geometry::Point(i, 100));
		ev->screen()->resize(Geometry::Point(500, 500));
		Sleep(10);
	}
}

int main(int argc, const char* argv[])
{

	Screens::ScreenManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));

	while(1)
	{
		// std::cout << "updating processes" << std::endl;
		// Process::ProcessManager::instance().update();
		Screens::ScreenManager::instance().update();
		Sleep(500);
	}

}

