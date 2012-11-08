#include "screens/recorder/recorder.h"
#include "screens/screens.h"
#include "screens/recorder/ffmpeg.h"
#include "screens/recorder/ffmpeg_context.h"
#include "screens/printer.h"
#include <sstream>

namespace Screens
{
	Recorder::Recorder(Screen* screen):
	_screen(screen),
	_ffmpeg(0),
	_recording(false)
	{


		std::stringstream ss;

		ss << "rtmp://10.0.1.30:1935/live/win_" << screen->id();
		char* copy = new char[1024];
		strcpy(copy, ss.str().c_str());

		FFmpegContext* ctx = new FFmpegContext(copy);
		ctx->qmin = 1;
		ctx->qmax = 11;
		ctx->me_subpel_quality = 0;
		ctx->gop_size = 300;
		ctx->scenechange_threshold = 500;
		ctx->frame_rate = 25;
		ctx->bit_rate = 64;

		this->_ctx = ctx;

		this->_ffmpeg = new FFMPeg(ctx);

	}

	void Recorder::start()
	{
		this->_recording = true;
	}

	void Recorder::stop()
	{
		this->_recording = false;
	}

	void Recorder::update()
	{
		if(!this->_recording) return;
		if(!this->_screen->exists())
		{
			std::cout << "cannot update recorder since screen doesn't exist" << std::endl;
			return;
		}
		Graphics::Bitmap* bm = Screens::Printer::print(this->_screen);
		this->_ffmpeg->broadcast(bm);
		delete bm;
	}

	Recorder::~Recorder()
	{
		delete this->_ffmpeg;
		delete this->_ctx;
	}
}
