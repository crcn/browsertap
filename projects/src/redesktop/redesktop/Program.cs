using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace redesktop
{
    public class Program
    {
        
        private const short SW_SHOW = 5;
        private const uint TOKEN_QUERY = 0x0008;
        private const uint TOKEN_DUPLICATE = 0x0002;
        private const uint TOKEN_ASSIGN_PRIMARY = 0x0001;
        private const int GENERIC_ALL_ACCESS = 0x10000000;
        private const int STARTF_USESHOWWINDOW = 0x00000001;
        private const int STARTF_FORCEONFEEDBACK = 0x00000040;
        private const uint CREATE_UNICODE_ENVIRONMENT = 0x00000400;

        static void Main(string[] args)
        {
            Console.WriteLine(Environment.MachineName);

            IntPtr token = IntPtr.Zero;

            bool ret = ADVAPI.LogonUser("B", Environment.MachineName, "kpcofgs", ADVAPI.LOGON32_LOGON_INTERACTIVE, 0, out token);
            //ProcessUtils.CreateProcessAsUser("B", ".", "kpcofgs", @"c:\program files\nodejs\node.exe c:\server.js");

            ADV
            Console.WriteLine(ret);
            Console.WriteLine(Marshal.GetLastWin32Error());


            Console.WriteLine("logged in");
            Console.Read();
        }

        private static IntPtr GetEnvironmentBlock(IntPtr token)
        {

            IntPtr envBlock = IntPtr.Zero;
            bool retVal = USERENV.CreateEnvironmentBlock(ref envBlock, token, false);
            if (retVal == false)
            {

                //Environment Block, things like common paths to My Documents etc. 
                //Will not be created if "false" 
                //It should not adversley affect CreateProcessAsUser. 

                string message = String.Format("CreateEnvironmentBlock Error: {0}", Marshal.GetLastWin32Error());
                Debug.WriteLine(message);

            }
            return envBlock;
        }
    }
}
