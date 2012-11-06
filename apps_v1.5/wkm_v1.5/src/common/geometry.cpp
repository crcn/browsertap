#include "common/geometry.h"

namespace Geometry
{
	Padding::Padding(int left, int right, int top, int bottom):
	left(left), right(right), top(top), bottom(bottom)
	{

	}

	Padding::Padding():
	left(0),right(0),top(0),bottom(0)
	{

	}

	Point::Point(int x, int y):
	x(x),
	y(y) 
	{

	}

	Point::Point():
	x(0),
	y(0)
	{
	}

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