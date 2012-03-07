#include "base/control/graphics.h"
#include "windows/control/window.h"
#include <windows.h>


namespace Control 
{

	/**
	 */
	
	Graphics::Bitmap* WindowGraphics::print(Geom::Padding padding)
	{
		int width;
		int height;
		HDC hdc;
		HDC hdcMem;
		HBITMAP bitmap;
		Geom::Rectangle rect;
		Geom::Padding pad;
		Window* win;

		win = (Window*)this->_window;

		//next we need the bounds for the given window
		rect = win->bounds();	

		//unable to print - too small
		if(rect.width < 10 || rect.height < 10) return 0;

		pad = win->padding();

		hdc = GetDC(win->target());
		hdcMem = CreateCompatibleDC(hdc);
		bitmap = CreateCompatibleBitmap(hdc, rect.width, rect.height);
		SelectObject(hdcMem, bitmap);

		BitBlt(hdcMem,
			0,0,
			rect.width, rect.height,
			hdc,
			0,0,
			SRCCOPY);


		return 0;
	}
}