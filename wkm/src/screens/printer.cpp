#define _WIN32_WINNT 0x0501

#include "screens/printer.h"
#include "screens/screens.h"
#include <Winuser.h>
#include <windows.h>
#include <stdio.h>
#include <iostream>


char* CaptureAnImage(Screens::Screen* screen, Geometry::Rectangle& rect)
{
    HWND hWnd = screen->target();
    HDC hdcWindow;
    HDC hdcMemDC = NULL;
    HDC hdcDesktop = NULL;
    HBITMAP hbmScreen = NULL;
    BITMAP bmpScreen;

    // Retrieve the handle to a display device context for the client 
    // area of the window. 
    hdcWindow = GetDC(hWnd);

    // Create a compatible DC which is used in a BitBlt from the window DC
    hdcMemDC = CreateCompatibleDC(hdcWindow); 
    
    // Create a compatible bitmap from the Window DC
    hbmScreen = CreateCompatibleBitmap(hdcWindow, rect.width, rect.height);
    
    // RedrawWindow(hWnd, NULL, NULL, RDW_INVALIDATE | RDW_ALLCHILDREN);
    // InvalidateRgn(hWnd, NULL, false);

    // Sleep(40);

    // Select the compatible bitmap into the compatible memory DC.
    SelectObject(hdcMemDC, hbmScreen);
    	
    // PrintWindow(hWnd, hdcMemDC, 0);

        // std::cout << rect.width << " " << std::endl;
    HRGN rgn;
        rgn = CreateRectRgn(0, 0, 2000, 2000);

        SetWindowRgn(GetDesktopWindow(), rgn, false);

    //this is ABSOLUTELY needed for many reasons. If we do print-window the user won't see drop menus
    //right clicks, etc.
    if(true || screen->inFocus()) {
        Geometry::Rectangle b = screen->bounds();
        hdcDesktop = GetDC(GetDesktopWindow());
        // BitBlt(hdcMemDC, -b.x + 100, -b.y + 100, 600, 400, hdcDesktop, 100, 100, SRCCOPY);
        BitBlt(hdcMemDC, 0, 0, rect.width, rect.height, hdcWindow, rect.x, rect.y, SRCCOPY);
        // PatBlt(hdcMemDC, 0, 0, rect.width, rect.height, PATCOPY);
    } else {
        PrintWindow(hWnd, hdcMemDC, 0);
    }



    // Get the BITMAP from the HBITMAP
    GetObject(hbmScreen,sizeof(BITMAP),&bmpScreen);
     
    BITMAPINFOHEADER   bi;
     
    bi.biSize = sizeof(BITMAPINFOHEADER);    
    bi.biWidth = bmpScreen.bmWidth;    
    bi.biHeight = -bmpScreen.bmHeight;  
    bi.biPlanes = 1;    
    bi.biBitCount = 32;    
    bi.biCompression = BI_RGB;    
    bi.biSizeImage = 0;  
    bi.biXPelsPerMeter = 0;    
    bi.biYPelsPerMeter = 0;    
    bi.biClrUsed = 0;    
    bi.biClrImportant = 0;

    DWORD dwBmpSize = ((bmpScreen.bmWidth * bi.biBitCount + 31) / 32) * 4 * bmpScreen.bmHeight;

    // Starting with 32-bit Windows, GlobalAlloc and LocalAlloc are implemented as wrapper functions that 
    // call HeapAlloc using a handle to the process's default heap. Therefore, GlobalAlloc and LocalAlloc 
    // have greater overhead than HeapAlloc.
    // HANDLE hDIB = GlobalAlloc(GHND,dwBmpSize); 
    char *lpbitmap = new char[dwBmpSize];


    // Gets the "bits" from the bitmap and copies them into a buffer 
    // which is pointed to by lpbitmap.
    GetDIBits(hdcWindow, hbmScreen, 0,
        (UINT)bmpScreen.bmHeight,
        lpbitmap,
        (BITMAPINFO *)&bi, DIB_RGB_COLORS);

    DeleteObject(hbmScreen);
    DeleteObject(hdcMemDC);
    ReleaseDC(hWnd, hdcWindow);
    if(hdcDesktop) ReleaseDC(GetDesktopWindow(), hdcDesktop);

    return lpbitmap;
}

namespace Screens
{
	Graphics::Bitmap* Printer::print(Screen* screen, Geometry::Padding padding, Geometry::Rectangle bounds)
	{
		if(bounds.width < 10 || bounds.height < 10) return 0;

		//scale the bounds given with the padding. Padding is extra useful for doing stuff such as getting rid of window chrome
		/*Geometry::Rectangle realBounds = Geometry::Rectangle(padding.left,
															 padding.top,
															 bounds.width - padding.left - padding.right,
															 bounds.height - padding.top - padding.bottom);*/


        Geometry::Rectangle rect = screen->bounds();
		//next, capture the image
		const char* buffer = CaptureAnImage(screen, rect);


		//finally return the bitmap which also contains the bounds so the recorder can properly scale & print the image
		return new Graphics::Bitmap(buffer, bounds);
	}

	Graphics::Bitmap* Printer::print(Screen* screen, Geometry::Padding padding)
	{
		return Printer::print(screen, padding, screen->bounds());
	}

	Graphics::Bitmap* Printer::print(Screen* screen)
	{
		return Printer::print(screen, Geometry::Padding(), screen->bounds());
	}
}