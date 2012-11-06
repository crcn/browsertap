
#define WINVER 0x0500
#include <string>
#include <Windows.h>
#include <iostream>
#include <stdlib.h>
#include "psapi.h"
#include "common/events.h"
#include "screens/screens.h"
#include "json/reader.h"

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

	Json::Value root;
	Json::Reader reader;

	bool success = reader.parse("{\"age\":5}", root);
	std::cout << success << std::endl;

	std::cout << root["age"].asInt() << std::endl;
	return 0;

	Screens::ScreenManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));

	while(1)
	{
		// std::cout << "updating processes" << std::endl;
		// Process::ProcessManager::instance().update();
		Screens::ScreenManager::instance().update();
		Sleep(500);
	}

}

