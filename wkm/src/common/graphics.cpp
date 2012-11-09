#include "common/graphics.h"


namespace Graphics 
{

	/**
	 */

	Bitmap::Bitmap(const char *buffer, Geometry::Rectangle& bounds) 
	{
		this->_buffer = buffer;
		this->_bounds = bounds;
	}

	/**
	 */

	const char* Bitmap::buffer() 
	{
		return this->_buffer;
	}

	/**
	 */

	Geometry::Rectangle& Bitmap::bounds() 
	{
		return this->_bounds;
	}

	/**
	 */

	Bitmap::~Bitmap()
	{
		delete this->_buffer;
	}

}