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
		const char* src = ss.str().c_str();
		int size = strlen(src);
		const char* copy = (const char*)malloc(sizeof(char) * size);
		memcpy((void*)copy, (void*)src, size + 1);


		FFmpegContext* ctx = new FFmpegContext(copy);
		ctx->qmin = 1;
		ctx->qmax = 11;
		ctx->me_subpel_quality = 0;
		ctx->gop_size = 300;
		ctx->scenechange_threshold = 500;
		ctx->frame_rate = 25;

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
		Graphics::Bitmap* bm = Screens::Printer::print(this->_screen);
		this->_ffmpeg->broadcast(bm);
		delete bm;
	}

	Recorder::~Recorder()
	{

	}
}
