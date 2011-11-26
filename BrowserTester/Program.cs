using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace BrowserTester
{
    using core;
    using virt;

    class Program
    {
        static void Main(string[] args)
        {

           Application app = new Application("C:\\Users\\craig\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe");

           app.Open();

           // Application app2 = new Application("C:\\Users\\craig\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe");

          //  app2.Open();

            Console.ReadLine();

            app.GetWindow().Print().Save("c:\\tmp\\test.png", ImageFormat.Png);
          //  app2.GetWindow().Print().Save("c:\\tmp\\test2.png", ImageFormat.Png);

            Console.ReadLine();
        }
    }
}
