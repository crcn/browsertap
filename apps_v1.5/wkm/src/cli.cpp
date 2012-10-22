
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
		Geom::Rectangle bounds;

		// std::cout << cli->bounds.width << " " << cli->bounds.height << std::endl;

		if(cli->bounds.width > 0 && cli->bounds.height > 0) {
			bounds = cli->bounds;
		} else {
			bounds = cli->window()->bounds();
		}

		Graphics::Bitmap* bmp = cli->window()->graphics()->print(cli->padding, bounds);

		cli->mediaBroadcaster()->broadcast(bmp);

		//std::cout << "broadcasting rtmp video" << std::endl;

		delete bmp;

		// Sleep(30);
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
	std::cout << "Usage: cli.exe [rtmp_path] [width] [height] [left] [right] [top] [bottom]" << std::endl;

	return 1;
}


int main(int argc, const char* argv[]) {


	//arg must be present
	if(argc < 8) {
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
	cli->bounds.width = atoi(argv[2]);
	cli->bounds.height = atoi(argv[3]);
	cli->padding.left = atoi(argv[4]);
	cli->padding.right = atoi(argv[5]);
	cli->padding.top = atoi(argv[6]);
	cli->padding.bottom = atoi(argv[7]);


	init_broadcast_thread(cli);



	cli->start();



}