
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
	delete event->listener();
}

int main(int argc, const char* argv[])
{

	while(1)
	{
		// std::cout << "updating processes" << std::endl;
		// Process::ProcessManager::instance().update();
		Screens::ScreenManager::instance().update();
		Sleep(500);
	}

}

