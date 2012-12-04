#ifndef SCREENS_RECORDER_H_
#define SCREENS_RECORDER_H_

#include <string>
#include "screens/recorder/ffmpeg_context.h"

namespace Screens
{
	class Screen;
	class FFMPeg;

	class Recorder
	{
	public:
		Recorder(Screen* screen);
		void start(std::string output);
		FFmpegContext* context();
		void stop();
		void update();
		void updateQuality();
		~Recorder();
	private:
		Screen* _screen;
		FFMPeg* _ffmpeg;
		bool _recording;
		FFmpegContext* _ctx;
	};
}
#endif