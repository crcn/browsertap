#ifndef SPEED_THROTTLE_H_
#define SPEED_THROTTLE_H_

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
	};
}

#endif