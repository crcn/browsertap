
#define WINVER 0x0500
#include <string>
#include <Windows.h>
#include <iostream>
#include <stdlib.h>
#include "psapi.h"
#include "common/events.h"

class TestEventListener : public Events::BaseEventListener
{
protected:
	void handleEvent(Events::Event event) 
	{
		std::cout << event.type << std::endl;
	}
};

int main(int argc, const char* argv[])
{
	Events::EventDispatcher *ed = new Events::EventDispatcher();
	ed->addEventListener("test", new TestEventListener());
	ed->dispatchEvent(Events::Event("test"));
}

