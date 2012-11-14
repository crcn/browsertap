#ifndef PRINTER_H_
#define PRINTER_H_

#include "common/graphics.h"
	
namespace Screens
{
	class Screen;
	class Printer
	{
	public:
		static Graphics::Bitmap* print(Screen* screen, Geometry::Padding padding, Geometry::Rectangle bounds);
		static Graphics::Bitmap* print(Screen* screen, Geometry::Padding padding);
		static Graphics::Bitmap* print(Screen* screen);
	};
}
#endif