#include <windows.h>
#include <Tchar.h>

#define DESKTOP_ALL (DESKTOP_READOBJECTS | DESKTOP_CREATEWINDOW | \
DESKTOP_CREATEMENU | DESKTOP_HOOKCONTROL | DESKTOP_JOURNALRECORD | \
DESKTOP_JOURNALPLAYBACK | DESKTOP_ENUMERATE | DESKTOP_WRITEOBJECTS | \
DESKTOP_SWITCHDESKTOP | STANDARD_RIGHTS_REQUIRED)

#define WINSTA_ALL (WINSTA_ENUMDESKTOPS | WINSTA_READATTRIBUTES | \
WINSTA_ACCESSCLIPBOARD | WINSTA_CREATEDESKTOP | \
WINSTA_WRITEATTRIBUTES | WINSTA_ACCESSGLOBALATOMS | \
WINSTA_EXITWINDOWS | WINSTA_ENUMERATE | WINSTA_READSCREEN | \
STANDARD_RIGHTS_REQUIRED)

#define GENERIC_ACCESS (GENERIC_READ | GENERIC_WRITE | \
GENERIC_EXECUTE | GENERIC_ALL)

BOOL AddAceToWindowStation(HWINSTA hwinsta, PSID psid);

BOOL AddAceToDesktop(HDESK hdesk, PSID psid);

BOOL GetLogonSID (HANDLE hToken, PSID *ppsid);

VOID FreeLogonSID (PSID *ppsid);

BOOL StartInteractiveClientProcess (
    LPTSTR lpszUsername,    // client to log on
    LPTSTR lpszDomain,      // domain of client's account
    LPTSTR lpszPassword,    // client's password
    LPTSTR lpCommandLine    // command line to execute
) 
{
   HANDLE      hToken;
   HDESK       hdesk = NULL;
   HWINSTA     hwinsta = NULL, hwinstaSave = NULL;
   PROCESS_INFORMATION pi;
   PSID pSid = NULL;
   STARTUPINFO si;
   BOOL bResult = FALSE;

// Log the client on to the local computer.

   if (!LogonUser(
           lpszUsername,
           lpszDomain,
           lpszPassword,
           LOGON32_LOGON_INTERACTIVE,
           LOGON32_PROVIDER_DEFAULT,
           &hToken) ) 
   {
      goto Cleanup;
   }

// Save a handle to the caller's current window station.

   if ( (hwinstaSave = GetProcessWindowStation() ) == NULL)
      goto Cleanup;

// Get a handle to the interactive window station.

   hwinsta = OpenWindowStation(
       _T("winsta0"),                   // the interactive window station 
       FALSE,                       // handle is not inheritable
       READ_CONTROL | WRITE_DAC);   // rights to read/write the DACL

   if (hwinsta == NULL) 
      goto Cleanup;

// To get the correct default desktop, set the caller's 
// window station to the interactive window station.

   if (!SetProcessWindowStation(hwinsta))
      goto Cleanup;

// Get a handle to the interactive desktop.

   hdesk = OpenDesktop(
      _T("default"),     // the interactive window station 
      0,             // no interaction with other desktop processes
      FALSE,         // handle is not inheritable
      READ_CONTROL | // request the rights to read and write the DACL
      WRITE_DAC | 
      DESKTOP_WRITEOBJECTS | 
      DESKTOP_READOBJECTS);

// Restore the caller's window station.

   if (!SetProcessWindowStation(hwinstaSave)) 
      goto Cleanup;

   if (hdesk == NULL) 
      goto Cleanup;

// Get the SID for the client's logon session.

   if (!GetLogonSID(hToken, &pSid)) 
      goto Cleanup;

// Allow logon SID full access to interactive window station.

   if (! AddAceToWindowStation(hwinsta, pSid) ) 
      goto Cleanup;

// Allow logon SID full access to interactive desktop.

   if (! AddAceToDesktop(hdesk, pSid) ) 
      goto Cleanup;

// Impersonate client to ensure access to executable file.

   if (! ImpersonateLoggedOnUser(hToken) ) 
      goto Cleanup;

// Initialize the STARTUPINFO structure.
// Specify that the process runs in the interactive desktop.

   ZeroMemory(&si, sizeof(STARTUPINFO));
   si.cb= sizeof(STARTUPINFO);
   si.lpDesktop = TEXT("winsta0\\default");

// Launch the process in the client's logon session.

   bResult = CreateProcessAsUser(
      hToken,            // client's access token
      NULL,              // file to execute
      lpCommandLine,     // command line
      NULL,              // pointer to process SECURITY_ATTRIBUTES
      NULL,              // pointer to thread SECURITY_ATTRIBUTES
      FALSE,             // handles are not inheritable
      NORMAL_PRIORITY_CLASS | CREATE_NEW_CONSOLE,   // creation flags
      NULL,              // pointer to new environment block 
      NULL,              // name of current directory 
      &si,               // pointer to STARTUPINFO structure
      &pi                // receives information about new process
   ); 

// End impersonation of client.

   RevertToSelf();

   if (bResult && pi.hProcess != INVALID_HANDLE_VALUE) 
   { 
      WaitForSingleObject(pi.hProcess, INFINITE); 
      CloseHandle(pi.hProcess); 
   } 

   if (pi.hThread != INVALID_HANDLE_VALUE)
      CloseHandle(pi.hThread);  

Cleanup: 

   if (hwinstaSave != NULL)
      SetProcessWindowStation (hwinstaSave);

// Free the buffer for the logon SID.

   if (pSid)
      FreeLogonSID(&pSid);

// Close the handles to the interactive window station and desktop.

   if (hwinsta)
      CloseWindowStation(hwinsta);

   if (hdesk)
      CloseDesktop(hdesk);

// Close the handle to the client's access token.

   if (hToken != INVALID_HANDLE_VALUE)
      CloseHandle(hToken);  

   return bResult;
}

BOOL AddAceToWindowStation(HWINSTA hwinsta, PSID psid)
{
   ACCESS_ALLOWED_ACE   *pace = NULL;
   ACL_SIZE_INFORMATION aclSizeInfo;
   BOOL                 bDaclExist;
   BOOL                 bDaclPresent;
   BOOL                 bSuccess = FALSE;
   DWORD                dwNewAclSize;
   DWORD                dwSidSize = 0;
   DWORD                dwSdSizeNeeded;
   PACL                 pacl;
   PACL                 pNewAcl = NULL;
   PSECURITY_DESCRIPTOR psd = NULL;
   PSECURITY_DESCRIPTOR psdNew = NULL;
   PVOID                pTempAce;
   SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
   unsigned int         i;

   __try
   {
      // Obtain the DACL for the window station.

      if (!GetUserObjectSecurity(
             hwinsta,
             &si,
             psd,
             dwSidSize,
             &dwSdSizeNeeded)
      )
      if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
      {
         psd = (PSECURITY_DESCRIPTOR)HeapAlloc(
               GetProcessHeap(),
               HEAP_ZERO_MEMORY,
               dwSdSizeNeeded);

         if (psd == NULL)
            __leave;

         psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(
               GetProcessHeap(),
               HEAP_ZERO_MEMORY,
               dwSdSizeNeeded);

         if (psdNew == NULL)
            __leave;

         dwSidSize = dwSdSizeNeeded;

         if (!GetUserObjectSecurity(
               hwinsta,
               &si,
               psd,
               dwSidSize,
               &dwSdSizeNeeded)
         )
            __leave;
      }
      else
         __leave;

      // Create a new DACL.

      if (!InitializeSecurityDescriptor(
            psdNew,
            SECURITY_DESCRIPTOR_REVISION)
      )
         __leave;

      // Get the DACL from the security descriptor.

      if (!GetSecurityDescriptorDacl(
            psd,
            &bDaclPresent,
            &pacl,
            &bDaclExist)
      )
         __leave;

      // Initialize the ACL.

      ZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
      aclSizeInfo.AclBytesInUse = sizeof(ACL);

      // Call only if the DACL is not NULL.

      if (pacl != NULL)
      {
         // get the file ACL size info
         if (!GetAclInformation(
               pacl,
               (LPVOID)&aclSizeInfo,
               sizeof(ACL_SIZE_INFORMATION),
               AclSizeInformation)
         )
            __leave;
      }

      // Compute the size of the new ACL.

      dwNewAclSize = aclSizeInfo.AclBytesInUse +
            (2*sizeof(ACCESS_ALLOWED_ACE)) + (2*GetLengthSid(psid)) -
            (2*sizeof(DWORD));

      // Allocate memory for the new ACL.

      pNewAcl = (PACL)HeapAlloc(
            GetProcessHeap(),
            HEAP_ZERO_MEMORY,
            dwNewAclSize);

      if (pNewAcl == NULL)
         __leave;

      // Initialize the new DACL.

      if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
         __leave;

      // If DACL is present, copy it to a new DACL.

      if (bDaclPresent)
      {
         // Copy the ACEs to the new ACL.
         if (aclSizeInfo.AceCount)
         {
            for (i=0; i < aclSizeInfo.AceCount; i++)
            {
               // Get an ACE.
               if (!GetAce(pacl, i, &pTempAce))
                  __leave;

               // Add the ACE to the new ACL.
               if (!AddAce(
                     pNewAcl,
                     ACL_REVISION,
                     MAXDWORD,
                     pTempAce,
                    ((PACE_HEADER)pTempAce)->AceSize)
               )
                  __leave;
            }
         }
      }

      // Add the first ACE to the window station.

      pace = (ACCESS_ALLOWED_ACE *)HeapAlloc(
            GetProcessHeap(),
            HEAP_ZERO_MEMORY,
            sizeof(ACCESS_ALLOWED_ACE) + GetLengthSid(psid) -
                  sizeof(DWORD));

      if (pace == NULL)
         __leave;

      pace->Header.AceType  = ACCESS_ALLOWED_ACE_TYPE;
      pace->Header.AceFlags = CONTAINER_INHERIT_ACE |
                   INHERIT_ONLY_ACE | OBJECT_INHERIT_ACE;
      pace->Header.AceSize  = LOWORD(sizeof(ACCESS_ALLOWED_ACE) +
                   GetLengthSid(psid) - sizeof(DWORD));
      pace->Mask            = GENERIC_ACCESS;

      if (!CopySid(GetLengthSid(psid), &pace->SidStart, psid))
         __leave;

      if (!AddAce(
            pNewAcl,
            ACL_REVISION,
            MAXDWORD,
            (LPVOID)pace,
            pace->Header.AceSize)
      )
         __leave;

      // Add the second ACE to the window station.

      pace->Header.AceFlags = NO_PROPAGATE_INHERIT_ACE;
      pace->Mask            = WINSTA_ALL;

      if (!AddAce(
            pNewAcl,
            ACL_REVISION,
            MAXDWORD,
            (LPVOID)pace,
            pace->Header.AceSize)
      )
         __leave;

      // Set a new DACL for the security descriptor.

      if (!SetSecurityDescriptorDacl(
            psdNew,
            TRUE,
            pNewAcl,
            FALSE)
      )
         __leave;

      // Set the new security descriptor for the window station.

      if (!SetUserObjectSecurity(hwinsta, &si, psdNew))
         __leave;

      // Indicate success.

      bSuccess = TRUE;
   }
   __finally
   {
      // Free the allocated buffers.

      if (pace != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)pace);

      if (pNewAcl != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)pNewAcl);

      if (psd != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)psd);

      if (psdNew != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)psdNew);
   }

   return bSuccess;

}

BOOL AddAceToDesktop(HDESK hdesk, PSID psid)
{
   ACL_SIZE_INFORMATION aclSizeInfo;
   BOOL                 bDaclExist;
   BOOL                 bDaclPresent;
   BOOL                 bSuccess = FALSE;
   DWORD                dwNewAclSize;
   DWORD                dwSidSize = 0;
   DWORD                dwSdSizeNeeded;
   PACL                 pacl;
   PACL                 pNewAcl = NULL;
   PSECURITY_DESCRIPTOR psd = NULL;
   PSECURITY_DESCRIPTOR psdNew = NULL;
   PVOID                pTempAce;
   SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
   unsigned int         i;

   __try
   {
      // Obtain the security descriptor for the desktop object.

      if (!GetUserObjectSecurity(
            hdesk,
            &si,
            psd,
            dwSidSize,
            &dwSdSizeNeeded))
      {
         if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
         {
            psd = (PSECURITY_DESCRIPTOR)HeapAlloc(
                  GetProcessHeap(),
                  HEAP_ZERO_MEMORY,
                  dwSdSizeNeeded );

            if (psd == NULL)
               __leave;

            psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(
                  GetProcessHeap(),
                  HEAP_ZERO_MEMORY,
                  dwSdSizeNeeded);

            if (psdNew == NULL)
               __leave;

            dwSidSize = dwSdSizeNeeded;

            if (!GetUserObjectSecurity(
                  hdesk,
                  &si,
                  psd,
                  dwSidSize,
                  &dwSdSizeNeeded)
            )
               __leave;
         }
         else
            __leave;
      }

      // Create a new security descriptor.

      if (!InitializeSecurityDescriptor(
            psdNew,
            SECURITY_DESCRIPTOR_REVISION)
      )
         __leave;

      // Obtain the DACL from the security descriptor.

      if (!GetSecurityDescriptorDacl(
            psd,
            &bDaclPresent,
            &pacl,
            &bDaclExist)
      )
         __leave;

      // Initialize.

      ZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
      aclSizeInfo.AclBytesInUse = sizeof(ACL);

      // Call only if NULL DACL.

      if (pacl != NULL)
      {
         // Determine the size of the ACL information.

         if (!GetAclInformation(
               pacl,
               (LPVOID)&aclSizeInfo,
               sizeof(ACL_SIZE_INFORMATION),
               AclSizeInformation)
         )
            __leave;
      }

      // Compute the size of the new ACL.

      dwNewAclSize = aclSizeInfo.AclBytesInUse +
            sizeof(ACCESS_ALLOWED_ACE) +
            GetLengthSid(psid) - sizeof(DWORD);

      // Allocate buffer for the new ACL.

      pNewAcl = (PACL)HeapAlloc(
            GetProcessHeap(),
            HEAP_ZERO_MEMORY,
            dwNewAclSize);

      if (pNewAcl == NULL)
         __leave;

      // Initialize the new ACL.

      if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
         __leave;

      // If DACL is present, copy it to a new DACL.

      if (bDaclPresent)
      {
         // Copy the ACEs to the new ACL.
         if (aclSizeInfo.AceCount)
         {
            for (i=0; i < aclSizeInfo.AceCount; i++)
            {
               // Get an ACE.
               if (!GetAce(pacl, i, &pTempAce))
                  __leave;

               // Add the ACE to the new ACL.
               if (!AddAce(
                  pNewAcl,
                  ACL_REVISION,
                  MAXDWORD,
                  pTempAce,
                  ((PACE_HEADER)pTempAce)->AceSize)
               )
                  __leave;
            }
         }
      }

      // Add ACE to the DACL.

      if (!AddAccessAllowedAce(
            pNewAcl,
            ACL_REVISION,
            DESKTOP_ALL,
            psid)
      )
         __leave;

      // Set new DACL to the new security descriptor.

      if (!SetSecurityDescriptorDacl(
            psdNew,
            TRUE,
            pNewAcl,
            FALSE)
      )
         __leave;

      // Set the new security descriptor for the desktop object.

      if (!SetUserObjectSecurity(hdesk, &si, psdNew))
         __leave;

      // Indicate success.

      bSuccess = TRUE;
   }
   __finally
   {
      // Free buffers.

      if (pNewAcl != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)pNewAcl);

      if (psd != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)psd);

      if (psdNew != NULL)
         HeapFree(GetProcessHeap(), 0, (LPVOID)psdNew);
   }

   return bSuccess;
}
