using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Diagnostics;

namespace winproc
{
    class Program
    {
        static void Main(string[] args)
        {
            //args = new string[2]{"C:\\Program Files\\Mozilla Firefox\\firefox.exe", "http://google.com"};

              
            if (args.Length < 2) Error("Usage: [app path] [args]");

            String Application = args[0];
            String Args = args[1];


            App app = new App(Application);


            if (!app.Start(Args, true))
            {
                Error("Unable to open application - is it already running?");
            }

            new Commands(app).Process();

            app.Kill();

            Console.WriteLine("Exiting");
        }


        static void Error(String Message)
        {
            Console.Error.WriteLine(Message);
            Process.GetCurrentProcess().Kill();
        }
    }
}