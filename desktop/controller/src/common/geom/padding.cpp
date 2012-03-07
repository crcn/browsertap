#include "geom/padding.h"

namespace Geom 
{
	Padding::Padding(int left, int right, int top, int bottom):
	left(left), right(right), top(top), bottom(bottom)
	{

	}

	Padding::Padding():
	left(0),right(0),top(0),bottom(0)
	{

	}
}