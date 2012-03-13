using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing.Imaging;

namespace winproc
{
    class Commands
    {
        private App _app;

        public Commands(App app)
        {
            this._app = app;
        }


        public void Process()
        {
            String Command;
            bool KeepRunning = true;

            while (KeepRunning)
            {
                Command = Console.ReadLine().ToLower();

                switch (Command)
                {
                    case "kill":
                        KeepRunning = false;
                    break;
                    case "screenshot":
                    Console.WriteLine("enter a png path");
                     this._app.CaptureWindowToFile(Console.ReadLine(), ImageFormat.Png);
                     Console.WriteLine("Saved");
                    break;
                }
            }
        }
    }
}
