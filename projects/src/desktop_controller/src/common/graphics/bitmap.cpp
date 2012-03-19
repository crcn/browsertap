#include "common/graphics/bitmap.h"
#include <iostream>


namespace Graphics 
{

	/**
	 */

	Bitmap::Bitmap(const char *buffer, Geom::Rectangle& bounds) 
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

	Geom::Rectangle& Bitmap::bounds() 
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