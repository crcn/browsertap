#ifndef SCREENS_RECORDER_H_
#define SCREENS_RECORDER_H_

namespace Screens
{
	class Screen;

	class Recorder
	{
	public:
		Recorder(Screen* screen);
		void start();
		void stop();
	private:
		Screen* _screen;
	};
}
#endif