
#define WINVER 0x0500
#include <string>
#include <Windows.h>
#include <iostream>
#include <stdlib.h>
#include "psapi.h"
#include "common/events.h"
#include "process/process.h"

void handleEvent(Events::Event* event)
{
	delete event->listener();
}

int main(int argc, const char* argv[])
{

	// Process::Process* process =
	Process::ProcessManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));
	Process::ProcessManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));
	Process::ProcessManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));
	Process::ProcessManager::instance().addEventListener("open", new Events::CbEventListener(&handleEvent));
	while(1)
	{
		// std::cout << "updating processes" << std::endl;
		Process::ProcessManager::instance().update();
		Sleep(500);
	}

}

