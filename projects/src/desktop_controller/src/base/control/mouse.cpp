#include "base/control/mouse.h"

namespace Control
{
	Mouse::Mouse() 
	{
		//do nothing
	}

	/**
	 */
	
	void Mouse::offset(Geom::Point newOffset)
	{
		this->_offset = newOffset;
	}

	/**
	 */

	Geom::Point& Mouse::offset()
	{
		return this->_offset;
	}
}