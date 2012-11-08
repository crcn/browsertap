#ifndef SCREENS_RECORDER_H_
#define SCREENS_RECORDER_H_

#include <string>

namespace Screens
{
	class Screen;
	class FFMPeg;
	class FFmpegContext;

	class Recorder
	{
	public:
		Recorder(Screen* screen);
		void start(std::string output);
		void stop();
		void update();
		~Recorder();
	private:
		Screen* _screen;
		FFMPeg* _ffmpeg;
		bool _recording;
		FFmpegContext* _ctx;
	};
}
#endif