using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;

namespace winproc
{
    public class NativeMethods
    {
        // This is a call to unmanaged code.     
        [DllImport("user32.dll")]
        //Get a pointer to the desktop window
        public extern static IntPtr GetDesktopWindow();

        [DllImport("user32.dll")]
        //Get a device context from the desktop window
        public static extern IntPtr GetWindowDC(IntPtr hwnd);
        //[DllImport("gdi32.dll", EntryPoint = "CreateCompatibleDC")]
        [DllImport("gdi32.dll")]
        public static extern IntPtr CreateCompatibleDC(IntPtr hdc);
        [DllImport("gdi32.dll")]
        public static extern IntPtr CreateCompatibleBitmap(IntPtr hdc, int nWidth, int nHeight);
        [DllImport("gdi32.dll")]
        public static extern IntPtr SelectObject(IntPtr hdc, IntPtr bmp);
        [DllImport("gdi32.dll")]
        public static extern IntPtr DeleteObject(IntPtr hDc);
        [DllImport("gdi32.dll")]
        public static extern IntPtr DeleteDC(IntPtr hDc);
        [DllImport("user32.dll")]
        public static extern IntPtr ReleaseDC(IntPtr hWnd, IntPtr hDc);


        [System.Runtime.InteropServices.DllImport("gdi32.dll")]
        public static extern bool BitBlt
             (IntPtr hDestDC,       // handle to destination DC
             int nXDest,            // X-coordinate of destination upper-left corner
             int nYDest,            // Y-coordinate of destination upper-left corner
             int nWidthDest,        // Width of destination rectangle
             int nHeightDest,       // Height of destination rectangle
             IntPtr hSrcDC,         // Handle to source DC
             int nXSrc,             // X-coordinate of source upper-left corner
             int nYSrc,             // Y-coordinate of source upper-left corner
             int rasterOp  // raster operation code
            );
    }
}
