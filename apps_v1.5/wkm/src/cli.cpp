
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

	int timeout = cli->mediaBroadcaster()->context()->capture_timeout;

	//MUST give CPU a rest...
	if(timeout == 0) timeout = 1; 


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
	

		Sleep(timeout);
	}

	return 0;
}


void init_broadcast_thread(Client::Console* cli) 
{
	DWORD threadId;
	CreateThread(NULL, 0, broadcast_video, cli, 0, &threadId);

	//pthread_create(&t1, NULL, &broadcast_video, NULL);
}


int usage() {

	// std::cout << "Some parameters are missing.." << std::cout;
	std::cout << "Usage: cli.exe [rtmp_path] [width] [height] [left] [right] [top] [bottom]" << std::endl;

	return 1;
}

#define MAP_ATOI(to, flag) \
	if(strcmp(flag, argv[i]) == 0) { \
		to = atoi(argv[++i]); \
	}

#define MAP_CHAR(to, flag) \
	if(strcmp(flag, argv[i]) == 0) \
		to = argv[++i]; 


int main(int argc, const char* argv[]) {


	//arg must be present
	/*if(argc < 8) {
		return usage();
	}*/

	Geom::Rectangle bounds;
	Geom::Padding padding;
	Broadcast::FFmpegContext* ctx = new Broadcast::FFmpegContext(NULL);

	ctx->qmin = 1; //good mix of quality
	ctx->qmax = 11;
	ctx->me_subpel_quality = 0; //low quality
	ctx->gop_size = 300;
	ctx->scenechange_threshold = 500;
	ctx->frame_rate = 25;
	ctx->bit_rate = 64;

	// last_redictor_count, 
	// directpred

	for(int i = 1; i < argc; i++)
	{

		MAP_CHAR(ctx->output, "-o")
		MAP_ATOI(bounds.width, "-w")
		MAP_ATOI(bounds.height, "-h")
		MAP_ATOI(padding.left, "-pl")
		MAP_ATOI(padding.right, "-pr")
		MAP_ATOI(padding.top, "-pt")
		MAP_ATOI(padding.bottom, "-pb")
		MAP_ATOI(ctx->bit_rate, "-b")
		MAP_ATOI(ctx->capture_timeout, "-timeout")
		MAP_ATOI(ctx->me_subpel_quality, "-subq")
		MAP_ATOI(ctx->qmin, "-qmin")
		MAP_ATOI(ctx->qmax, "-qmax")
		MAP_ATOI(ctx->gop_size, "-gop_size")
		MAP_ATOI(ctx->frame_rate, "-fr")
		MAP_ATOI(ctx->scenechange_threshold, "-scenechange_threshold")
		MAP_ATOI(ctx->qcompress, "-qcompress")
		MAP_ATOI(ctx->qblur, "-qblur")
	}
	std::cout << ctx->qmin << std::endl;

	if(ctx->output == NULL) 
	{
		std::cerr << "-o must be defined" << std::endl;
		return 1;
	}





	Broadcast::FFMPeg* bf = new Broadcast::FFMPeg(ctx);
  
  	//the window we're controlling
	Control::Window* win        = Control::Windows::desktop();

	//the mouse we're controlling
	Control::Mouse* mouse       = new Control::Mouse();

	//the keyboard (duh)
	Control::Keyboard* keyboard = new Control::Keyboard();

	//the client which controls everything
	Client::Console* cli        = new Client::Console(win, bf, mouse, keyboard);
	cli->bounds = bounds;
	cli->padding = padding;
	/*cli->bounds.width = atoi(argv[2]);
	cli->bounds.height = atoi(argv[3]);
	cli->padding.left = atoi(argv[4]);
	cli->padding.right = atoi(argv[5]);
	cli->padding.top = atoi(argv[6]);
	cli->padding.bottom = atoi(argv[7]);*/
		
	//skip first seg (rtmp server)
	


	init_broadcast_thread(cli);



	cli->start();



}