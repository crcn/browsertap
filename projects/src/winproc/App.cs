using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Threading;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;


namespace winproc
{
    
    /**
     * A neat wrapper around the process api
     */

    class App
    {

        private String _path;
        private String _realpath;
        private Process _process;
        
        public App(String path)
        {
            this._path = path;
            this._realpath = Lnk.GetShortcutTarget(path);
        }

        /**
         * kills the process
         */

        public void Kill()
        {
            if (this._process == null) return;

            this._process.Kill();
            this._process = null;
        }

        /**
         * starts the process
         */

        public bool Start(String Arguments, bool WaitUntilWindow = false)
        {
            if (this._process != null) return false;

            //make sure to kill the process first so we don't exit immediately.
            this._KillRunning();

            this._process = new Process();
            this._process.StartInfo.FileName = this._path;
            this._process.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;
            this._process.StartInfo.Arguments = Arguments;
            this._process.Start();

            if (WaitUntilWindow)
            {
                return this._WaitUntilWindow();
            }


            return true;
        }


        /**
         * kills the process incase it's already running
         */

        private void _KillRunning()
        {
            foreach (Process proc in Process.GetProcesses())
            {
                try
                {
                    if (proc.MainModule.FileName == this._realpath)
                    {
                        Console.WriteLine("Killing already running process");
                        proc.Kill();
                    }

                }
                catch (Win32Exception e)
                {
                }
            }

        }

        /**
         */

        public bool HasExited
        {
            get { return this._process != null && this._process.HasExited; }
        }

        /**
         */

        public IntPtr MainWindowHandle
        {
            get { return this._process.MainWindowHandle; }
        }


        /**
         */

        public void CaptureWindowToFile(String Location, ImageFormat Format)
        {
            ScreenCapture sc = new ScreenCapture();
            sc.CaptureScreenToFile(Location, Format);
        }


        /**
         * pauses the current thread until a main window is found
         */

        private bool _WaitUntilWindow()
        {

            bool DoesNotHaveMainWindow = true;
            int MaxTries       = 20;
            int Tries = 0;

            while(!HasExited && DoesNotHaveMainWindow && Tries++ < MaxTries)
            {
                DoesNotHaveMainWindow = (int)this._process.MainWindowHandle.ToInt32() == 0;
                Thread.Sleep(100);

            }


            return !DoesNotHaveMainWindow;

        }
    }
}
