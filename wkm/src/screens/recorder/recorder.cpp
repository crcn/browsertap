#include "screens/recorder/recorder.h"
#include "screens/screens.h"
#include "screens/recorder/ffmpeg.h"
#include "screens/recorder/ffmpeg_context.h"
#include "screens/printer.h"

namespace Screens
{
	Recorder::Recorder(Screen* screen):
	_screen(screen),
	_ffmpeg(0),
	_recording(false),
	_ctx(NULL)
	{


		FFmpegContext* ctx = new FFmpegContext(NULL);
		ctx->qmin = 1;
		ctx->qmax = 11;
		ctx->me_subpel_quality = 0;
		ctx->gop_size = 70;
		// ctx->scenechange_threshold = -10000;
		ctx->frame_rate = 25;
		ctx->bit_rate = 64;
		this->_ctx = ctx;

		this->_ffmpeg = new FFMPeg(ctx);

	}

	void Recorder::start(std::string output)
	{
		char* copy = new char[1024];
		strcpy(copy, output.c_str());
		this->_ctx->output = copy;

		this->_recording = true;
	}

	FFmpegContext* Recorder::context()
	{
		return this->_ctx;
		// return NULL;
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
