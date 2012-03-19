
#define WINVER 0x0500
#include <stdio.h>
#include <windows.h>
#include <iostream>
#include "control/window.h" 
#include "base/control/mouse.h" 
#include "base/control/keyboard.h" 
#include "common/client/console.h"
#include "common/broadcast/ffmpeg.h"
#include <windows.h>


DWORD WINAPI broadcast_video(LPVOID param) 
{
	Client::Console* cli = (Client::Console*) param;

	while(true) 
	{
		Graphics::Bitmap* bmp = cli->window()->graphics()->print();

		cli->mediaBroadcaster()->broadcast(bmp);

		delete bmp;

		Sleep(1);
	}

	return 0;
}


void init_broadcast_thread(Client::Console* cli) 
{
	std::cout << "broadcasting desktop to " << cli->mediaBroadcaster()->location() << std::endl;

	DWORD threadId;
	CreateThread(NULL, 0, broadcast_video, cli, 0, &threadId);

	//pthread_create(&t1, NULL, &broadcast_video, NULL);
}


int usage() {

	// std::cout << "Some parameters are missing.." << std::cout;
	std::cout << "Usage: cli.exe [rtmp_path]" << std::endl;

	return 1;
}


int main(int argc, const char* argv[]) {

	//arg must be present
	if(argc < 2) {
		return usage();
	}


	const char* output = argv[1];


	Broadcast::FFMPeg* bf = new Broadcast::FFMPeg(output);
  
  	//the window we're controlling
	Control::Window* win        = Control::Windows::desktop();

	//the mouse we're controlling
	Control::Mouse* mouse       = new Control::Mouse();

	//the keyboard (duh)
	Control::Keyboard* keyboard = new Control::Keyboard();

	//the client which controls everything
	Client::Console* cli        = new Client::Console(win, bf, mouse, keyboard);



	init_broadcast_thread(cli);



	cli->start();



}