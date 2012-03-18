
#define WINVER 0x0500
#include <stdio.h>
#include <windows.h>
#include <iostream>
#include "control/window.h" 
#include "base/control/mouse.h" 
#include "base/control/keyboard.h" 
#include "common/client/console.h"


void enter()
{
	char ch;
	std::cout << "press any key to continue" << std::endl;
	std::cin >> ch;
}


int main(int argc, const char* argv[]) {
  
	std::cout << "DONE" << std::endl;
//	enter();

	Control::Window* win = Control::Windows::desktop();
	Control::Mouse* mouse = new Control::Mouse();
	Control::Keyboard* keyboard = new Control::Keyboard();
	Client::Console* cli = new Client::Console(win, mouse, keyboard);

	cli->start();



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