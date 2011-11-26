using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Linq;
using System.Text;


namespace BrowserTester.virt
{
    using core;

    public class Application
    {
        private String _path;
        private Process _process;
        private UserList _users;
        private Window _window;

        /**
         */

        public Application(String path)
        {
            this._path = path;
            this._users = new UserList(this);
        }

        /**
         * opens the given process
         */
        
        public Process Open()
        {
            Process proc = this._process = new Process();

            proc.StartInfo.CreateNoWindow = true;
            proc.StartInfo.FileName = this._path;

            proc.Start();
            return proc;
        }

        /**
         */

        public Process GetProcess()
        {
            return this._process;
        }

        /**
         */

        public Window GetWindow()
        {
            if (this._window != null) return this._window;

            return this._window = new Window(this);
        }


        /**
         * returns the users controlling this application
         */

        public UserList GetUsers()
        {
            return this._users;
        }


    }
}
