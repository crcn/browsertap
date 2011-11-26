using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace BrowserTester.virt
{
    using core;

    public class Window
    {
        private Application _app;

        public Window(Application app)
        {
            this._app = app;
        }


        public Bitmap Print()
        {
            Process proc = this._app.GetProcess();
            proc.Refresh();


            Console.WriteLine(proc.ProcessName);

            User32.Rect rect = new User32.Rect();
            User32.GetWindowRect(proc.MainWindowHandle, ref rect);

            int width = rect.right - rect.left;
            int height = rect.bottom - rect.top;

            Bitmap bmp = new Bitmap(width, height, PixelFormat.Format32bppArgb);
            Graphics gfx = Graphics.FromImage(bmp);
            IntPtr hdc = gfx.GetHdc();

            Console.WriteLine(proc.MainWindowHandle);
            User32.PrintWindow(proc.MainWindowHandle, hdc, 0);

            gfx.ReleaseHdc(hdc);
            gfx.Dispose();



            return bmp;
        }

    }
}
