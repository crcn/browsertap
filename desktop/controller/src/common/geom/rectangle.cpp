#include "common/geom/rectangle.h"

namespace Geom 
{

	Rectangle::Rectangle(int x, int y, int width, int height):
	x(x), y(y), width(width), height(height)
	{

	}

	Rectangle::Rectangle(int width, int height):
	x(0), y(0), width(width), height(height)
	{

	}

	Rectangle::Rectangle():
	x(0), y(0), width(0), height(0)
	{

	}
}