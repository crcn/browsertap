#include "screens/printer.h"
#include <windows.h>
#include <stdio.h>
#include <iostream>

char* CaptureAnImage(HWND hWnd, Geometry::Rectangle& rect)
{
    HDC hdcScreen;
    HDC hdcWindow;
    HDC hdcMemDC = NULL;
    HBITMAP hbmScreen = NULL;
    BITMAP bmpScreen;

    // Retrieve the handle to a display device context for the client 
    // area of the window. 
    hdcScreen = GetDC(NULL);
    hdcWindow = GetDC(hWnd);

    // Create a compatible DC which is used in a BitBlt from the window DC
    hdcMemDC = CreateCompatibleDC(hdcWindow); 

    if(!hdcMemDC)
    {
        //MessageBox(hWnd, L"CreateCompatibleDC has failed",L"Failed", MB_OK);
    }


    //This is the best stretch mode
    SetStretchBltMode(hdcWindow,HALFTONE);

    //The source DC is the entire screen and the destination DC is the current window (HWND)
    if(!StretchBlt(hdcWindow, 
               0,0, 
               rect.x + rect.width, 0, 
               hdcScreen, 
               0,0,
               GetSystemMetrics (SM_CXSCREEN),
               GetSystemMetrics (SM_CYSCREEN),
               SRCCOPY))
    {
        //MessageBox(hWnd, L"StretchBlt has failed",L"Failed", MB_OK);
        //goto done;
    }

    
    // Create a compatible bitmap from the Window DC
    hbmScreen = CreateCompatibleBitmap(hdcWindow, rect.width, rect.height);
    
    if(!hbmScreen)
    {
        //MessageBox(hWnd, L"CreateCompatibleBitmap Failed",L"Failed", MB_OK);
    }


    // Select the compatible bitmap into the compatible memory DC.
    SelectObject(hdcMemDC,hbmScreen);
    
    // Bit block transfer into our compatible memory DC.
    if(!BitBlt(hdcMemDC, 
               0,0, 
               rect.width, rect.height, 
               hdcWindow, 
               rect.x, rect.y,
               SRCCOPY))
    {
        //MessageBox(hWnd, L"BitBlt has failed", L"Failed", MB_OK);
        //goto done;
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
    char *lpbitmap = new char[dwBmpSize];


    // Gets the "bits" from the bitmap and copies them into a buffer 
    // which is pointed to by lpbitmap.
    GetDIBits(hdcWindow, hbmScreen, 0,
        (UINT)bmpScreen.bmHeight,
        lpbitmap,
        (BITMAPINFO *)&bi, DIB_RGB_COLORS);

   
    //Clean up
    DeleteObject(hbmScreen);
    DeleteObject(hdcMemDC);
    ReleaseDC(NULL,hdcScreen);
    ReleaseDC(hWnd,hdcWindow);

    return lpbitmap;
}

namespace Screens
{
	Graphics::Bitmap* Printer::print(Screen* screen, Geometry::Padding padding, Geometry::Rectangle bounds)
	{
		if(bounds.width < 10 || bounds.height < 10) return 0;

		//scale the bounds given with the padding. Padding is extra useful for doing stuff such as getting rid of window chrome
		Geometry::Rectangle realBounds = Geometry::Rectangle(bounds.x + padding.left,
															 bounds.y + padding.top,
															 bounds.width - padding.left - padding.right,
															 bounds.height - padding.top - padding.bottom);

		//next, capture the image
		const char* buffer = CaptureAnImage(screen->target(), realBounds);


		//finally return the bitmap which also contains the bounds so the recorder can properly scale & print the image
		return new Graphics::Bitmap(buffer, realBounds);
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