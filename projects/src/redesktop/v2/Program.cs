using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace v2
{
    class Program
    {
        
        [STAThread]
        static void Main(string[] args)
        {
            string pwstr = "kpcofgs";
            char[] pwc = pwstr.ToCharArray();
            System.Security.SecureString ss = new System.Security.SecureString();
            foreach (char c in pwc)
            {
                ss.AppendChar(c);
            }
            Process proc = new Process();
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.LoadUserProfile = true;
            proc.StartInfo.UserName = "B";
            proc.StartInfo.Password = ss;
            proc.StartInfo.Domain = Environment.MachineName;
            //proc.StartInfo.FileName = @"c:\Users\B\Desktop\browsers\chrome\19.lnk";
            proc.StartInfo.FileName = @"c:\windows\system32\calc.exe";
            
            proc.Start();

        }


        public Program()
        {

            
            /*rdp.OnConnected += new IMsTscAxEvents_OnConnectedEventHandler(onEvent);
            rdp.OnLogonError += new IMsTscAxEvents_OnLogonErrorEventHandler(onError);
            rdp.OnUserNameAcquired += new IMsTscAxEvents_OnUserNameAcquiredEventHandler(onUser);
            rdp.OnWarning += new IMsTscAxEvents_OnWarningEventHandler(onError);
            rdp.OnAuthenticationWarningDisplayed += new IMsTscAxEvents_OnAuthenticationWarningDisplayedEventHandler(onEvent);
            rdp.OnDisconnected += new IMsTscAxEvents_OnDisconnectedEventHandler(onError);
            rdp.OnFatalError += new IMsTscAxEvents_OnFatalErrorEventHandler(onError);
            rdp.OnConnecting += new IMsTscAxEvents_OnConnectingEventHandler(onEvent);*/


            new Thread(new ThreadStart(rdp)).Start();

            while (true)
            {
                Thread.Sleep(100);
            }
        }

        void rdp()
        {


            MSTSCLib.MsRdpClient5 rdp = new MSTSCLib.MsRdpClient5(); //new AxMSTSCLib.AxMsRdpClient6();
            rdp.Server = "localhost";
            rdp.UserName = "B";
            rdp.Domain = Environment.MachineName;
            rdp.FullScreen = true;
            rdp.DesktopWidth = 800;
            rdp.DesktopHeight = 700;
            rdp.AdvancedSettings5.RedirectDrives = false;
            rdp.AdvancedSettings5.RedirectPrinters = false;
            rdp.AdvancedSettings5.RedirectSmartCards = false;
            rdp.AdvancedSettings5.RedirectPorts = false;
            rdp.AdvancedSettings5.DisplayConnectionBar = false;
            rdp.AdvancedSettings5.ClearTextPassword = "kpcofgs";

            rdp.SecuredSettings.WorkDir = @"c:\";
            
            Console.WriteLine("CON");
            Console.WriteLine(rdp.ConnectingText);
            rdp.CreateVirtualChannels("mychan1,mychan2");
            rdp.Connect();
            //rdp.RemoteProgram.RemoteProgramMode = true;
            //rdp.RemoteProgram.ServerStartProgram(@"C:\Windows\system32\calc.exe", "", "", false, "", false);
            
            while (true)
            {
                Console.WriteLine(rdp.ConnectingText);
                Thread.Sleep(100);
            }
        }

        void onUser(string name)
        {
            Console.WriteLine("USER");
        }

        void onEvent()
        {
            Console.WriteLine("EVENT");
        }

        void onError(int code)
        {
            Console.WriteLine("ERROR");
        }

    }
}
