using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace BrowserTester
{
    using core;

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");


            Process pc = Process.Start("C:\\Users\\craig\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe");
             
            
            Process[] procs = Process.GetProcesses();

            for (int i = 0; i < procs.Length; i++)
            {
                Process proc = procs[i];
                Console.WriteLine(proc.ProcessName);
            }

            Console.ReadLine();
        }
    }
}
