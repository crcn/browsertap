#ifndef SPEED_THROTTLE_H_
#define SPEED_THROTTLE_H_

#include <time.h>

namespace Speed
{
	class Throttle
	{
	public:
		Throttle(int ticks);
		bool skip();
		void ticks(int value);
	private:
		int _ticks;
		int _currentTick;
		int _currentTime;
		clock_t _startTickTime;
	};
}

#endif