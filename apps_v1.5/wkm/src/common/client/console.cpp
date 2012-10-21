#include "common/client/console.h"
#include <iostream>


namespace Client {


	/**
	 */

	Console::Console(Control::Window* window, Broadcast::FFMPeg* broadcaster, Control::Mouse* mouse, Control::Keyboard* keyboard) 
	{
		this->_window           = window;
		this->_keyboard         = keyboard;
		this->_mouse            = mouse;
		this->_mediaBroadcaster = broadcaster;
	}

	/**
	 */

	Broadcast::FFMPeg* Console::mediaBroadcaster() 
	{
		return this->_mediaBroadcaster;
	}

	/**
	 */

	Control::Window* Console::window()
	{
		return this->_window;
	}

	/**
	 */

	void Console::start()
	{
		while(true) {

			std::string command;

			std::cin >> command;

			//std::cout << "command: " << command << std::endl;


			if(!strcmp(command.c_str(), "resize")) {
				std::cin >> this->bounds.width >> this->bounds.height;
				// std::cout << "resize to " << this->bounds.width << "x" << this->bounds.height << std::endl;
			} else
			if(!strcmp(command.c_str(), "padding")) {

				std::cin >> this->padding.left >> this->padding.right >> this->padding.top >> this->padding.bottom;

			} else
			if(!strcmp(command.c_str(), "mouse")) {
				
				int code, x, y, dwData;

				std::cin >> code >> x >> y >> dwData;


				this->_mouse->dispatchEvent(code, x + this->padding.left, y + this->padding.top, dwData);
			} else
			if(!strcmp(command.c_str(), "keyboard")) {
					
				int code, bScan, dwFlags;


				std::cin >> code >> bScan >> dwFlags;

				this->_keyboard->dispatchEvent(code, bScan, dwFlags);
			} else 
			if(!strcmp(command.c_str(), "quality")) {

			}

		}
	}

}