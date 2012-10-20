///////////////////////////////////////////////////////////////////////////////////////////////
//
//    This File is Part of the CallButler Open Source PBX (http://www.codeplex.com/callbutler
//
//    Copyright (c) 2005-2008, Jim Heising
//    All rights reserved.
//
//    Redistribution and use in source and binary forms, with or without modification,
//    are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//
//    * Redistributions in binary form must reproduce the above copyright notice,
//      this list of conditions and the following disclaimer in the documentation and/or
//      other materials provided with the distribution.
//
//    * Neither the name of Jim Heising nor the names of its contributors may be
//      used to endorse or promote products derived from this software without specific prior
//      written permission.
//
//    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
//    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
//    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//    IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
//    INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
//    NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
//    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//    WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//    POSSIBILITY OF SUCH DAMAGE.
//
///////////////////////////////////////////////////////////////////////////////////////////////

using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Security.Permissions;

namespace redesktop
{
    public class ProcessUtils
    {
        [StructLayout(LayoutKind.Sequential)]
        public struct STARTUPINFO
        {
            public Int32 cb;
            public string lpReserved;
            public string lpDesktop;
            public string lpTitle;
            public Int32 dwX;
            public Int32 dwY;
            public Int32 dwXSize;
            public Int32 dwXCountChars;
            public Int32 dwYCountChars;
            public Int32 dwFillAttribute;
            public Int32 dwFlags;
            public Int16 wShowWindow;
            public Int16 cbReserved2;
            public IntPtr lpReserved2;
            public IntPtr hStdInput;
            public IntPtr hStdOutput;
            public IntPtr hStdError;
        }

        // Declare the logon types as constants
        const long LOGON32_LOGON_INTERACTIVE = 2;
        const long LOGON32_LOGON_NETWORK = 3;

        // Declare the logon providers as constants
        const long LOGON32_PROVIDER_DEFAULT = 0;
        const long LOGON32_PROVIDER_WINNT50 = 3;
        const long LOGON32_PROVIDER_WINNT40 = 2;
        const long LOGON32_PROVIDER_WINNT35 = 1;


        [StructLayout(LayoutKind.Sequential)]
        public struct PROCESS_INFORMATION
        {
            public IntPtr hProcess;
            public IntPtr hThread;
            public Int32 dwProcessID;
            public Int32 dwThreadID;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct SECURITY_ATTRIBUTES
        {
            public Int32 Length;
            public IntPtr lpSecurityDescriptor;
            public bool bInheritHandle;
        }

        public enum SECURITY_IMPERSONATION_LEVEL
        {
            SecurityAnonymous,
            SecurityIdentification,
            SecurityImpersonation,
            SecurityDelegation
        }

        public enum TOKEN_TYPE
        {
            TokenPrimary = 1,
            TokenImpersonation
        }

        public const int GENERIC_ALL_ACCESS = 0x10000000;

        [
           DllImport("kernel32.dll",
              EntryPoint = "CloseHandle", SetLastError = true,
              CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)
        ]
        public static extern bool CloseHandle(IntPtr handle);

        [
           DllImport("advapi32.dll",
              EntryPoint = "CreateProcessAsUser", SetLastError = true,
              CharSet = CharSet.Ansi, CallingConvention = CallingConvention.StdCall)
        ]
        public static extern bool
           CreateProcessAsUser(IntPtr hToken, string lpApplicationName, string lpCommandLine,
                               ref SECURITY_ATTRIBUTES lpProcessAttributes, ref SECURITY_ATTRIBUTES lpThreadAttributes,
                               bool bInheritHandle, Int32 dwCreationFlags, IntPtr lpEnvrionment,
                               string lpCurrentDirectory, ref STARTUPINFO lpStartupInfo,
                               ref PROCESS_INFORMATION lpProcessInformation);

        [
           DllImport("advapi32.dll",
              EntryPoint = "DuplicateTokenEx")
        ]
        public static extern bool
           DuplicateTokenEx(IntPtr hExistingToken, Int32 dwDesiredAccess,
                            ref SECURITY_ATTRIBUTES lpThreadAttributes,
                            Int32 ImpersonationLevel, Int32 dwTokenType,
                            ref IntPtr phNewToken);

        [DllImport("advapi32.dll", EntryPoint = "LogonUser")]
        private static extern bool LogonUser(string lpszUsername, string lpszDomain, string lpszPassword, int dwLogonType, int dwLogonProvider, ref IntPtr phToken);

        [DllImport("userenv.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool LoadUserProfile(IntPtr hToken, ref ProfileInfo lpProfileInfo);

        [DllImport("userenv.dll", SetLastError = true)]
        static extern bool CreateEnvironmentBlock(out IntPtr lpEnvironment, IntPtr hToken, bool bInherit);

        /// 
        /// Profile Info
        /// 
        [StructLayout(LayoutKind.Sequential)]
        public struct ProfileInfo
        {
            /// 
            /// Specifies the size of the structure, in bytes.
            /// 
            public int dwSize;

            /// 
            /// This member can be one of the following flags: PI_NOUI or PI_APPLYPOLICY
            /// 
            public int dwFlags;

            /// 
            /// Pointer to the name of the user. 
            /// This member is used as the base name of the directory in which to store a new profile. 
            /// 
            public string lpUserName;

            /// 
            /// Pointer to the roaming user profile path. 
            /// If the user does not have a roaming profile, this member can be NULL.
            /// 
            public string lpProfilePath;

            /// 
            /// Pointer to the default user profile path. This member can be NULL. 
            /// 
            public string lpDefaultPath;

            /// 
            /// Pointer to the name of the validating domain controller, in NetBIOS format. 
            /// If this member is NULL, the Windows NT 4.0-style policy will not be applied. 
            /// 
            public string lpServerName;

            /// 
            /// Pointer to the path of the Windows NT 4.0-style policy file. This member can be NULL. 
            /// 
            public string lpPolicyPath;

            /// 
            /// Handle to the HKEY_CURRENT_USER registry key. 
            /// 
            public IntPtr hProfile;
        }

        public static void CreateProcessAsUser(string username, string domain, string password, string commandLine)
        {
            IntPtr hToken = IntPtr.Zero;
            IntPtr hDupedToken = IntPtr.Zero;

            PROCESS_INFORMATION pi = new PROCESS_INFORMATION();

            try
            {
                bool result = LogonUser(username, domain, password, (int)LOGON32_LOGON_INTERACTIVE, (int)LOGON32_PROVIDER_DEFAULT, ref hToken);

                if (!result)
                {
                    throw new ApplicationException("LogonUser failed");
                }

                SECURITY_ATTRIBUTES sa = new SECURITY_ATTRIBUTES();
                sa.Length = Marshal.SizeOf(sa);

                result = DuplicateTokenEx(
                      hToken,
                      GENERIC_ALL_ACCESS,
                      ref sa,
                      (int)SECURITY_IMPERSONATION_LEVEL.SecurityIdentification,
                      (int)TOKEN_TYPE.TokenPrimary,
                      ref hDupedToken
                   );

                if (!result)
                {
                    throw new ApplicationException("DuplicateTokenEx failed");
                }


                STARTUPINFO si = new STARTUPINFO();
                si.cb = Marshal.SizeOf(si);
                si.lpDesktop = "winsta0\\default";

                ProfileInfo info = new ProfileInfo();
                info.dwSize = Marshal.SizeOf(info);
                info.lpUserName = username;
                info.dwFlags = 1;

                result = LoadUserProfile(hDupedToken, ref info);

                if (!result)
                {
                    int error = Marshal.GetLastWin32Error();

                    throw new System.ComponentModel.Win32Exception(error);
                }

                IntPtr lpEnvironment;

                result = CreateEnvironmentBlock(out lpEnvironment, hDupedToken, false);

                if (!result)
                {
                    int error = Marshal.GetLastWin32Error();

                    throw new System.ComponentModel.Win32Exception(error);
                }

                result = CreateProcessAsUser(
                                     hDupedToken,
                                     null,
                                     commandLine,
                                     ref sa, ref sa,
                                     false, 0x00000400, lpEnvironment,
                                     null, ref si, ref pi
                               );

                if (!result)
                {
                    int error = Marshal.GetLastWin32Error();

                    throw new System.ComponentModel.Win32Exception(error);
                }
            }
            finally
            {
                if (pi.hProcess != IntPtr.Zero)
                    CloseHandle(pi.hProcess);
                if (pi.hThread != IntPtr.Zero)
                    CloseHandle(pi.hThread);
                if (hDupedToken != IntPtr.Zero)
                    CloseHandle(hDupedToken);
            }
        }
    }
}