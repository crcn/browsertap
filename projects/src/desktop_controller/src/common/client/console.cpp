#include "common/client/console.h"
#include <iostream>


namespace Client {


	/**
	 */

	Console::Console(Control::Window* window, Control::Mouse* mouse, Control::Keyboard* keyboard) 
	{
		this->_window = window;
		this->_keyboard = keyboard;
		this->_mouse = mouse;
	}

	/**
	 */

	void Console::start()
	{
		while(true) {

			std::string command;

			std::cin >> command;

			if(!strcmp(command.c_str(), "mouse")) {
				
				std::cout << "mouse move \n";

				int code, x, y, dwData;

				std::cin >> code >> x >> y >> dwData;


				this->_mouse->dispatchEvent(code, x, y, dwData);
			} else
			if(!strcmp(command.c_str(), "keyboard")) {
					
				int code, bScan, dwFlags;


				std::cin >> code >> bScan >> dwFlags;

				this->_keyboard->dispatchEvent(code, bScan, dwFlags);
			} 

		}
	}

}