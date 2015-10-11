
#include <Windows.h>
#include "./window.h"

namespace win32 {
  Window::Window(HWND target) {
    _target = target;
  }

  std::string Window::title() {
		char title[1024];
		GetWindowTextA(this->_target, title, sizeof(title));
		return title;
  }

  bool Window::isMinimized() {

    WINDOWPLACEMENT placement = WINDOWPLACEMENT();

    if (GetWindowPlacement(_target, &placement)) {
        // std::cout << placement.showCmd << std::endl;/
        if ((placement.showCmd == SW_MAXIMIZE) || (placement.showCmd == SW_SHOWNORMAL)) {
            return false;
        }
    }
    return true;
  }

  geom::Bounds Window::bounds() {

		RECT rect;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633519(v=vs.85).aspx
		GetWindowRect(this->_target, &rect);
    return geom::Bounds(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
  }

  void  Window::bounds(geom::Bounds bounds) {
  }

  graphics::Bitmap* Window::print() {

    geom::Bounds& rect = bounds();
    HWND hWnd = _target;
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

    // Select the compatible bitmap into the compatible memory DC.
    SelectObject(hdcMemDC, hbmScreen);

    //this is ABSOLUTELY needed for many reasons. If we do print-window the user won't see drop menus
    //right clicks, etc.
    hdcDesktop = GetDC(GetDesktopWindow());
    BitBlt(hdcMemDC, 0, 0, rect.width, rect.height, hdcDesktop, rect.x, rect.y, SRCCOPY);

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
    unsigned char *lpbitmap = new unsigned char[dwBmpSize];

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

    return new graphics::Bitmap(lpbitmap, sizeof(lpbitmap), rect);
  }
}
