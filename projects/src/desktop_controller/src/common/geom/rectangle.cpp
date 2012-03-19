#include "common/geom/rectangle.h"

namespace Geom 
{

	/**
	 */

	Rectangle::Rectangle(int x, int y, int width, int height):
	x(x), y(y), width(width), height(height)
	{

	}

	/**
	 */

	Rectangle::Rectangle(int width, int height):
	x(0), y(0), width(width), height(height)
	{

	}

	/**
	 */

	Rectangle::Rectangle():
	x(0), y(0), width(0), height(0)
	{

	}

	/**
	 */

	bool Rectangle::equals(Rectangle* cmp) 
	{
		return cmp->x == this->x && 
		cmp->y == this->y && 
		cmp->width == this->width && 
		cmp->height == this->height;
	}

	/**
	 */

	bool Rectangle::resize(Rectangle* rect)
	{
		if(this->equals(rect)) return false;

		this->x = rect->x;
		this->y = rect->y;
		this->width = rect->width;
		this->height = rect->height;

		return true;
	}
}