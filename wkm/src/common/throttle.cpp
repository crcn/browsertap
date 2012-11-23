#include "common/throttle.h"

namespace Speed
{
	Throttle::Throttle(int ticks):
	_ticks(ticks),
	_currentTick(0) { }	

	void Throttle::ticks(int value) 
	{
		_ticks = value;
	}

	bool Throttle::skip()
	{

		bool skip = true;

		if(this->_currentTick % _ticks == 0) 
		{
			skip = false;
		}

		this->_currentTick++;

		return skip;
	}
}