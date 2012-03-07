
#define WINVER 0x0500
#include <stdio.h>
#include <windows.h>
#include <iostream>
#include "control/window.h"

void enter()
{
	char ch;
	std::cout << "press any key to continue" << std::endl;
	std::cin >> ch;
}


int main(int argc, const char* argv[]) {


	enter();

	Control::Window* win = Control::Windows::desktop();

	win->graphics()->print();


	//Geom::Rectangle* win = new Geom::Rectangle();

	/**

	pseudocode

	DesktopWindow^ target = new DesktopWindow();
	FFMPegBroadcaster^ broadcaster = new FFMpegBroadcaster();
	ThriftClient^ client = new ThriftClient();

	while(client.control(target)) {

		broadcaster.dispatch(target->print());
		
	}
	

	*/

}