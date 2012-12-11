#include "common/throttle.h"
#include <iostream>

namespace Speed
{
	Throttle::Throttle(int ticks):
	_ticks(ticks),
	_currentTick(0),
	_startTickTime(0),
	_currentTime(0) { }	

	void Throttle::ticks(int value) 
	{
		_ticks = value;
	}

	bool Throttle::skip()
	{
		if(_startTickTime == 0) 
		{
			_startTickTime = clock();
		}

		bool skip = true;

		double diff = (clock() - _startTickTime)/(CLOCKS_PER_SEC/1000);

		//std::cout << (int)diff << std::endl;
		if(diff > _ticks) 
		{
			skip = false;
			_startTickTime = clock();
		}

		return skip;
	}
}