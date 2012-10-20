#include "stdafx.h"
#include <windows.h>
#include <stdio.h>
 
// Constants
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
 
// Prototypes
BOOL GetLogonSID(HANDLE hToken, PSID *ppsid);
VOID FreeLogonSID (PSID *ppsid);
BOOL StartInteractiveClientProcess (
    LPTSTR lpszUsername,    // client to log on
    LPTSTR lpszDomain,      // domain of client's account
    LPTSTR lpszPassword,    // client's password
    LPTSTR lpCommandLine    // command line to execute
      );
BOOL AddAceToWindowStation(HWINSTA hwinsta, PSID psid);
BOOL AddAceToDesktop(HDESK hdesk, PSID psid);
BOOL RemoveAceFromWindowStation(HWINSTA hwinsta, PSID psid);
BOOL RemoveAceFromDesktop(HDESK hdesk, PSID psid);
 
int wmain(int argc, WCHAR **argv)
{
    // The user is a valid account on the local computer
    WCHAR lpszUsername[] = L"B";   // Valid username
    WCHAR lpszDomain[] = L".";    // Using local user account database
    WCHAR lpszPassword[] = L"kpcofgs";      // Johnny's password
    WCHAR lpCommandLine[] = L"c:\windows\system32\calc.exe";
    BOOL RetVal;
 
    // Call StartInteractiveClientProcess()
    RetVal = StartInteractiveClientProcess (
    lpszUsername,    // client to log on
    lpszDomain,      // domain of client's account
    lpszPassword,    // client's password
    lpCommandLine    // command line to execute
);
      wprintf(L"StartInteractiveClientProcess() returns %d\n", RetVal);
      return 0;
}
 
BOOL GetLogonSID(HANDLE hToken, PSID *ppsid)
{
      BOOL bSuccess = FALSE;
      DWORD dwIndex;
      DWORD dwLength = 0;
      PTOKEN_GROUPS ptg = NULL;
     
      wprintf(L"\nGetting the Logon SID...\n");
 
    // Verify the parameter passed in is not NULL
    if (ppsid == NULL)
        goto Cleanup;
      else
            wprintf(L"ppsid is not NULL!\n");
     
      // Get required buffer size and allocate the TOKEN_GROUPS buffer
      if (!GetTokenInformation(
            hToken,         // handle to the access token
            TokenGroups,    // get information about the token's groups
            (LPVOID) ptg,   // pointer to TOKEN_GROUPS buffer
            0,              // size of buffer
            &dwLength       // receives required buffer size
            ))
      {
            if (GetLastError() != ERROR_INSUFFICIENT_BUFFER)
            {
                  wprintf(L"GetTokenInformation() 1 failed, error %d\n", GetLastError());
                  goto Cleanup;
            }
            else
                  wprintf(L"Well, we have ample buffer...\n");
 
            ptg = (PTOKEN_GROUPS)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY, dwLength);
           
            if (ptg == NULL)
                  goto Cleanup;
            else
                  wprintf(L"Heap allocated for ptg!\n");
      }
     
      // Get the token group information from the access token.
      if (!GetTokenInformation(
            hToken,         // handle to the access token
            TokenGroups,    // get information about the token's groups
            (LPVOID)ptg,   // pointer to TOKEN_GROUPS buffer
            dwLength,       // size of buffer
            &dwLength       // receives required buffer size
            ))
      {
            wprintf(L"GetTokenInformation() 2 failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
      {
            wprintf(L"GetTokenInformation() is pretty fine!\n");
            wprintf(L"ptg->GroupCount is %d\n", ptg->GroupCount);
            wprintf(L"ptg->Groups->Attributes is %d\n", ptg->Groups->Attributes);
      }
     
      // Loop through the groups to find the logon SID.
      for (dwIndex = 0; dwIndex < ptg->GroupCount; dwIndex++)
            if ((ptg->Groups[dwIndex].Attributes & SE_GROUP_LOGON_ID) ==  SE_GROUP_LOGON_ID)
            {
                  // Found the logon SID; make a copy of it.
                  dwLength = GetLengthSid(ptg->Groups[dwIndex].Sid);
                  *ppsid = (PSID) HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY, dwLength);
                 
                  if (*ppsid == NULL)
                        goto Cleanup;
                  else
                        wprintf(L"Heap allocated for *ppsid!\n");
                 
                  if (!CopySid(dwLength, *ppsid, ptg->Groups[dwIndex].Sid))
                  {
                        wprintf(L"CopySid() failed, error %d\n", GetLastError());
                        HeapFree(GetProcessHeap(), 0, (LPVOID)*ppsid);
                        goto Cleanup;
                  }
                  else
                        wprintf(L"CopySid() is fine!\n");
                  break;
            }
            bSuccess = TRUE;
 
Cleanup:
           
            // Free the buffer for the token groups.
            if (ptg != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)ptg);
 
      return bSuccess;
}
 
VOID FreeLogonSID (PSID *ppsid)
{
      wprintf(L"\nFreeing up the Logon SID...\n\n");
      HeapFree(GetProcessHeap(), 0, (LPVOID)*ppsid);
}
 
BOOL StartInteractiveClientProcess(
                                                   LPTSTR lpszUsername,    // client to log on
                                                   LPTSTR lpszDomain,        // domain of client's account
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
     
      wprintf(L"Starting the interactive client process...\n");
      // Log the client on to the local computer.
      if (!LogonUser(lpszUsername,lpszDomain,lpszPassword,LOGON32_LOGON_INTERACTIVE,LOGON32_PROVIDER_DEFAULT,&hToken))
      {
            wprintf(L"LogonUser() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"LogonUser() is working!\n");     
      // Save a handle to the caller's current window station.
      if ((hwinstaSave = GetProcessWindowStation()) == NULL)
            goto Cleanup;
      else
            wprintf(L"GetProcessWindowStation() should be fine!\n");     
      // Get a handle to the interactive window station.
      hwinsta = OpenWindowStation(
            L"winsta0",                  // the interactive window station
            FALSE,                       // handle is not inheritable
            READ_CONTROL | WRITE_DAC);   // rights to read/write the DACL
     
      if (hwinsta == NULL)
            goto Cleanup;
      else
            wprintf(L"OpenWindowStation() is working!\n");
     
      // To get the correct default desktop, set the caller's
      // window station to the interactive window station.
      if (!SetProcessWindowStation(hwinsta))
            goto Cleanup;
      else
            wprintf(L"SetProcessWindowStation() 1 is working!\n");
     

      // Get a handle to the interactive desktop.
      hdesk = OpenDesktop(
            L"default",    // the interactive window station
            0,                  // no interaction with other desktop processes
            FALSE,         // handle is not inheritable
            READ_CONTROL | // request the rights to read and write the DACL
            WRITE_DAC | DESKTOP_WRITEOBJECTS | DESKTOP_READOBJECTS);
     
      // Restore the caller's window station.
      if (!SetProcessWindowStation(hwinstaSave))
      {
            wprintf(L"SetProcessWindowStation() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"SetProcessWindowStation() 2 is working!\n");
     
      if (hdesk == NULL)
            goto Cleanup;
      else
            wprintf(L"OpenDesktop() is working!\n");
     
      // Get the SID for the client's logon session.
      if (!GetLogonSID(hToken, &pSid))
      {
            wprintf(L"GetLogonSID() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"GetLogonSID() is working!\n");
     
      // Allow logon SID full access to interactive window station.
      if (!AddAceToWindowStation(hwinsta, pSid))
      {
            wprintf(L"AddAceToWindowStation() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"AddAceToWindowStation() is working!\n");
     
      // Allow logon SID full access to interactive desktop.
      if (!AddAceToDesktop(hdesk, pSid))
      {
            wprintf(L"AddAceToDesktop() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"AddAceToDesktop() is working!\n");
     
      // Impersonate client to ensure access to executable file.
      if (!ImpersonateLoggedOnUser(hToken))
      {
            wprintf(L"ImpersonateLoggedOnUser() failed, error %d\n", GetLastError());
            goto Cleanup;
      }
      else
            wprintf(L"ImpersonateLoggedOnUser() is working!\n");
     
      // Initialize the STARTUPINFO structure.
      // Specify that the process runs in the interactive desktop.
      ZeroMemory(&si, sizeof(STARTUPINFO));
      si.cb= sizeof(STARTUPINFO);
      si.lpDesktop = L"winsta0\\default";
     
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
     
      // When running many times, it will keeps adding more ACLs to the Windows station until you hit some limit
      // http://support.microsoft.com/kb/185292/
      // Then SetUserObjectSecurity() will fails with ERROR_NOT_ENOUGH_QUOTA.
      // Undone any changes that were made to the Windows station and desktop.
      wprintf(L"Removing the ACE from Window station and desktop...\n");
      RemoveAceFromWindowStation(hwinsta, pSid);
      RemoveAceFromDesktop(hdesk, pSid);
     
      // End impersonation of client
      if(RevertToSelf() != 0)
            wprintf(L"RevertToSelf() is OK!\n");
      else
            wprintf(L"RevertToSelf() failed, error %d\n", GetLastError());
     
      if (bResult && pi.hProcess != INVALID_HANDLE_VALUE)
      {
            WaitForSingleObject(pi.hProcess, INFINITE);
 
            if(CloseHandle(pi.hProcess) != 0)
                  wprintf(L"pi.hProcess handle was closed successfully!\n");
            else
                  wprintf(L"Failed to close pi.hProcess handle, error %d\n", GetLastError());
      }
     
      if (pi.hThread != INVALID_HANDLE_VALUE)
      {
            if(CloseHandle(pi.hThread) != 0)
                  wprintf(L"pi.hThread handle was closed successfully!\n");
            else
                  wprintf(L"Failed to close pi.hThread handle, error %d\n", GetLastError());
      }
      else
            wprintf(L"pi.hThread handle already invalid!\n");
 
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
      ACCESS_ALLOWED_ACE   *pace;
      ACL_SIZE_INFORMATION aclSizeInfo;
      BOOL                 bDaclExist;
      BOOL                 bDaclPresent;
      BOOL                 bSuccess = FALSE;
      DWORD            dwNewAclSize;
      DWORD            dwSidSize = 0;
      DWORD            dwSdSizeNeeded;
      PACL                 pacl;
      PACL                 pNewAcl;
      PSECURITY_DESCRIPTOR psd = NULL;
      PSECURITY_DESCRIPTOR psdNew = NULL;
      PVOID                pTempAce;
      SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
      unsigned int         i;
     
      wprintf(L"\nAdding ACE to WindowStation...\n");
 
      __try
      {
            // Obtain the DACL for the window station.
            if (!GetUserObjectSecurity(hwinsta,&si,psd,dwSidSize,&dwSdSizeNeeded))
                  if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
                  {
                        psd = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                       
                        if (psd == NULL)
                              __leave;
                        else
                              wprintf(L"Heap allocated for psd!\n");
                       
                        psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                        if (psdNew == NULL)
                              __leave;
                        else
                              wprintf(L"Heap allocated for psdNew!\n");
                       
                        dwSidSize = dwSdSizeNeeded;
                        if (!GetUserObjectSecurity(hwinsta,&si,psd,dwSidSize,&dwSdSizeNeeded))
                        {
                              wprintf(L"GetUserObjectSecurity() failed, error %d\n", GetLastError());
                              __leave;
                        }
                        else
                              wprintf(L"GetUserObjectSecurity() is working!\n");
                  }
                  else
                        __leave;
           
            // Create a new DACL.
            if (!InitializeSecurityDescriptor(psdNew,SECURITY_DESCRIPTOR_REVISION))
            {
                  wprintf(L"InitializeSecurityDescriptor() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"InitializeSecurityDescriptor() is working!\n");
           
            // Get the DACL from the security descriptor.
            if (!GetSecurityDescriptorDacl(psd,&bDaclPresent,&pacl,&bDaclExist))
            {
                  wprintf(L"GetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"GetSecurityDescriptorDacl() is working!\n");
           
            // Initialize the ACL
            SecureZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
            aclSizeInfo.AclBytesInUse = sizeof(ACL);           
            // Call only if the DACL is not NULL
            if (pacl != NULL)
            {
                  // get the file ACL size info
                  if (!GetAclInformation(pacl,(LPVOID)&aclSizeInfo,sizeof(ACL_SIZE_INFORMATION),AclSizeInformation))
                  {
                        wprintf(L"GetAclInformation() failed, error %d\n", GetLastError());
                        __leave;
                  }
                  else
                        wprintf(L"GetAclInformation() is working!\n");
            }
           
            // Compute the size of the new ACL
            dwNewAclSize = aclSizeInfo.AclBytesInUse + (2*sizeof(ACCESS_ALLOWED_ACE)) + (2*GetLengthSid(psid)) - (2*sizeof(DWORD));           
            // Allocate memory for the new ACL
            pNewAcl = (PACL)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwNewAclSize);
           
            if (pNewAcl == NULL)
                  __leave;
            else
                  wprintf(L"Heap allocated for pNewAcl!\n");
           
            // Initialize the new DACL
            if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
            {
                  wprintf(L"InitializeAcl() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"InitializeAcl() is working!\n");
 
            // If DACL is present, copy it to a new DACL
            if (bDaclPresent)
            {
                  // Copy the ACEs to the new ACL.
                  if (aclSizeInfo.AceCount)
                  {
                        for (i=0; i < aclSizeInfo.AceCount; i++)
                        {
                              // Get an ACE.
                              if (!GetAce(pacl, i, &pTempAce))
                              {
                                    wprintf(L"GetAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                              else
                                    wprintf(L"GetAce() is working!\n");
 
                              // Add the ACE to the new ACL.
                              if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,pTempAce,((PACE_HEADER)pTempAce)->AceSize))
                              {
                                    wprintf(L"AddAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                              else
                                    wprintf(L"AddAce() is working!\n");
                        }
                  }
            }
           
            // Add the first ACE to the window station
            pace = (ACCESS_ALLOWED_ACE *)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY, sizeof(ACCESS_ALLOWED_ACE) + GetLengthSid(psid) -  sizeof(DWORD));
           
            if (pace == NULL)
                  __leave;
            else
                  wprintf(L"Heap allocated for pace!\n");
           
            pace->Header.AceType  = ACCESS_ALLOWED_ACE_TYPE;
            pace->Header.AceFlags = CONTAINER_INHERIT_ACE | INHERIT_ONLY_ACE | OBJECT_INHERIT_ACE;
            pace->Header.AceSize  = (WORD)(sizeof(ACCESS_ALLOWED_ACE) + GetLengthSid(psid) - sizeof(DWORD));
            pace->Mask            = GENERIC_ACCESS;
           
            if (!CopySid(GetLengthSid(psid), &pace->SidStart, psid))
            {
                  wprintf(L"CopySid() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"CopySid() is working!\n");
           
            if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,(LPVOID)pace,pace->Header.AceSize))
            {
                  wprintf(L"AddAce() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"AddAce() 1 is working!\n");
           
            // Add the second ACE to the window station
            pace->Header.AceFlags = NO_PROPAGATE_INHERIT_ACE;
            pace->Mask            = WINSTA_ALL;
           
            if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,(LPVOID)pace,pace->Header.AceSize))
            {
                  wprintf(L"AddAce() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"AddAce() 2 is working!\n");
           
            // Set a new DACL for the security descriptor
            if (!SetSecurityDescriptorDacl(psdNew,TRUE,pNewAcl,FALSE))
            {
                  wprintf(L"SetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"SetSecurityDescriptorDacl() is working!\n");
 
            // Set the new security descriptor for the window station
            if (!SetUserObjectSecurity(hwinsta, &si, psdNew))
            {
                  wprintf(L"SetUserObjectSecurity() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"SetUserObjectSecurity() is working!\n");
 
            // Indicate success
            bSuccess = TRUE;
}
__finally
{
      // Free the allocated buffers
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
      DWORD            dwNewAclSize;
      DWORD            dwSidSize = 0;
      DWORD            dwSdSizeNeeded;
      PACL                 pacl;
      PACL                 pNewAcl;
      PSECURITY_DESCRIPTOR psd = NULL;
      PSECURITY_DESCRIPTOR psdNew = NULL;
      PVOID                pTempAce;
      SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
      unsigned int         i;
     
      wprintf(L"\nAdding ACE to Desktop...\n");
 
      __try
      {
            // Obtain the security descriptor for the desktop object
            if (!GetUserObjectSecurity(hdesk,&si,psd,dwSidSize,&dwSdSizeNeeded))
            {
                  if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
                  {
                        psd = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                       
                        if (psd == NULL)
                              __leave;
                       
                        psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                       
                        if (psdNew == NULL)
                              __leave;
                       
                        dwSidSize = dwSdSizeNeeded;
                        if (!GetUserObjectSecurity(hdesk,&si,psd,dwSidSize,&dwSdSizeNeeded))
                        {
                              wprintf(L"GetUserObjectSecurity() failed, error %d\n", GetLastError());
                              __leave;
                        }
                  }
                  else
                        __leave;
            }
           
            // Create a new security descriptor
            if (!InitializeSecurityDescriptor(psdNew,SECURITY_DESCRIPTOR_REVISION))
            {
                  wprintf(L"InitializeSecurityDescriptor() failed, error %d\n", GetLastError());
                  __leave;
            }           
            // Obtain the DACL from the security descriptor
            if (!GetSecurityDescriptorDacl(psd,&bDaclPresent,&pacl,&bDaclExist))
            {
                  wprintf(L"GetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
           
            // Initialize
            ZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
            aclSizeInfo.AclBytesInUse = sizeof(ACL);
 
            // Call only if NULL DACL
            if (pacl != NULL)
            {
                  // Determine the size of the ACL information
                  if (!GetAclInformation(pacl,(LPVOID)&aclSizeInfo,sizeof(ACL_SIZE_INFORMATION),AclSizeInformation))
                  {
                        wprintf(L"GetAclInformation() failed, error %d\n", GetLastError());
                        __leave;
                  }
            }
           
            // Compute the size of the new ACL
            dwNewAclSize = aclSizeInfo.AclBytesInUse + sizeof(ACCESS_ALLOWED_ACE) +  GetLengthSid(psid) - sizeof(DWORD);           
            // Allocate buffer for the new ACL
            pNewAcl = (PACL)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwNewAclSize);
            if (pNewAcl == NULL)
                  __leave;
            // Initialize the new ACL
            if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
            {
                  wprintf(L"InitializeAcl() failed, error %d\n", GetLastError());
                  __leave;
            }
            // If DACL is present, copy it to a new DACL
            if (bDaclPresent)
            {
                  // Copy the ACEs to the new ACL.
                  if (aclSizeInfo.AceCount)
                  {
                        for (i=0; i < aclSizeInfo.AceCount; i++)
                        {
                              // Get an ACE
                              if (!GetAce(pacl, i, &pTempAce))
                              {
                                    wprintf(L"GetAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                              // Add the ACE to the new ACL.
                              if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,pTempAce,((PACE_HEADER)pTempAce)->AceSize))
                              {
                                    wprintf(L"AddAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                        }
                  }
            }
           
            // Add ACE to the DACL
            if (!AddAccessAllowedAce(pNewAcl,ACL_REVISION,DESKTOP_ALL,psid))
            {
                  wprintf(L"AddAccessAllowedAce() failed, error %d\n", GetLastError());
                  __leave;
            }
            // Set new DACL to the new security descriptor
            if (!SetSecurityDescriptorDacl(psdNew,TRUE,pNewAcl,FALSE))
            {
                  wprintf(L"SetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
            // Set the new security descriptor for the desktop object
            if (!SetUserObjectSecurity(hdesk, &si, psdNew))
            {
                  wprintf(L"SetUserObjectSecurity() failed, error %d\n", GetLastError());
                  __leave;
            }
            // Indicate success
            bSuccess = TRUE;
      }
      __finally
      {
            // Free buffers
            if (pNewAcl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pNewAcl);
            if (psd != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psd);
            if (psdNew != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psdNew);
      }
      return bSuccess;
}
 
BOOL RemoveAceFromWindowStation(HWINSTA hwinsta, PSID psid)
{
      ACL_SIZE_INFORMATION aclSizeInfo;
      BOOL                 bDaclExist;
      BOOL                 bDaclPresent;
      BOOL                 bSuccess = FALSE;
      DWORD            dwNewAclSize;
      DWORD            dwSidSize = 0;
      DWORD            dwSdSizeNeeded;
      PACL                 pacl;
      PACL                 pNewAcl;
      PSECURITY_DESCRIPTOR psd = NULL;
      PSECURITY_DESCRIPTOR psdNew = NULL;
      ACCESS_ALLOWED_ACE*  pTempAce;
      SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
      unsigned int         i;
     
      wprintf(L"\nRemoving ACE from Window Station...\n");
      __try
      {
            // Obtain the DACL for the window station
            if (!GetUserObjectSecurity(hwinsta,&si,psd,dwSidSize,&dwSdSizeNeeded))
                  if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
                  {
                        psd = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                       
                        if (psd == NULL)
                              __leave;
                        psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                        if (psdNew == NULL)
                              __leave;
                       
                        dwSidSize = dwSdSizeNeeded;
                        if (!GetUserObjectSecurity(hwinsta,&si,psd,dwSidSize,&dwSdSizeNeeded))
                        {
                              wprintf(L"GetUserObjectSecurity() failed, error %d\n", GetLastError());
                              __leave;
                        }
                  }
                  else
                        __leave;
           
            // Create a new DACL
            if (!InitializeSecurityDescriptor(psdNew,SECURITY_DESCRIPTOR_REVISION))
            {
                  wprintf(L"InitializeSecurityDescriptor() failed, error %d\n", GetLastError());
                  __leave;
            }
           
            // Get the DACL from the security descriptor
            if (!GetSecurityDescriptorDacl(psd,&bDaclPresent,&pacl,&bDaclExist))
            {
                  wprintf(L"GetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
           
            // Initialize the ACL
            ZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
            aclSizeInfo.AclBytesInUse = sizeof(ACL);
            // Call only if the DACL is not NULL
            if (pacl != NULL)
            {
                  // get the file ACL size info
                  if (!GetAclInformation(pacl,(LPVOID)&aclSizeInfo,sizeof(ACL_SIZE_INFORMATION),AclSizeInformation))
                  {
                        wprintf(L"GetAclInformation() failed, error %d\n", GetLastError());
                        __leave;
                  }
            }
           
            // Compute the size of the new ACL
            dwNewAclSize = aclSizeInfo.AclBytesInUse + (2*sizeof(ACCESS_ALLOWED_ACE)) + (2*GetLengthSid(psid)) - (2*sizeof(DWORD));           
            // Allocate memory for the new ACL
            pNewAcl = (PACL)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwNewAclSize);
           
            if (pNewAcl == NULL)
                  __leave;
            // Initialize the new DACL
            if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
            {
                  wprintf(L"InitializeAcl() failed, error %d\n", GetLastError());
                  __leave;
            }
            // If DACL is present, copy it to a new DACL
            if (bDaclPresent)
            {
                  // Copy the ACEs to the new ACL.
                  if (aclSizeInfo.AceCount)
                  {
                        for (i=0; i < aclSizeInfo.AceCount; i++)
                        {
                              // Get an ACE.
                              if (!GetAce(pacl, i, reinterpret_cast<void**>(&pTempAce)))
                              {
                                    wprintf(L"GetAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                              else
                                    wprintf(L"GetAce() looks OK!\n");
 
                              if (!EqualSid(psid, &pTempAce->SidStart))
                              {
                                    // Add the ACE to the new ACL.
                                    if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,pTempAce,((PACE_HEADER)pTempAce)->AceSize))
                                    {
                                          wprintf(L"AddAce() failed, error %d\n", GetLastError());
                                          __leave;
                                    }
                                    else
                                          wprintf(L"AddAce() looks OK!\n");
                              }
                              else
                                    wprintf(L"EqualSid() is pretty fine!\n");
                        }
                  }
            }
           
            if(pacl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pacl);
            // Set a new DACL for the security descriptor
            if (!SetSecurityDescriptorDacl(psdNew,TRUE,pNewAcl,FALSE))
            {
                  wprintf(L"SetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
            // Set the new security descriptor for the window station
            if (!SetUserObjectSecurity(hwinsta, &si, psdNew))
            {
                  wprintf(L"SetUserObjectSecurity() failed, error %d\n", GetLastError());
                  __leave;
            }
            // Indicate success
            bSuccess = TRUE;
      }
      __finally
      {
            // Free the allocated buffers
            if(pacl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pacl);
            if (pNewAcl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pNewAcl);
            if (psd != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psd);
            if (psdNew != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psdNew);
      }
      return bSuccess;
}
 
BOOL RemoveAceFromDesktop(HDESK hdesk, PSID psid)
{
      ACL_SIZE_INFORMATION aclSizeInfo;
      BOOL                 bDaclExist;
      BOOL                 bDaclPresent;
      BOOL                 bSuccess = FALSE;
      DWORD            dwNewAclSize;
      DWORD            dwSidSize = 0;
      DWORD            dwSdSizeNeeded;
      PACL                 pacl;
      PACL                 pNewAcl;
      PSECURITY_DESCRIPTOR psd = NULL;
      PSECURITY_DESCRIPTOR psdNew = NULL;
      ACCESS_ALLOWED_ACE*  pTempAce;
      SECURITY_INFORMATION si = DACL_SECURITY_INFORMATION;
      unsigned int         i;
     
      wprintf(L"\nRemoving ACE from Desktop...\n");
 
      __try
      {
            // Obtain the security descriptor for the desktop object
            if (!GetUserObjectSecurity(hdesk,&si,psd,dwSidSize,&dwSdSizeNeeded))
            {
                  if (GetLastError() == ERROR_INSUFFICIENT_BUFFER)
                  {
                        psd = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                        if (psd == NULL)
                              __leave;
                        psdNew = (PSECURITY_DESCRIPTOR)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwSdSizeNeeded);
                        if (psdNew == NULL)
                              __leave;
                       
                        dwSidSize = dwSdSizeNeeded;
                        if (!GetUserObjectSecurity(hdesk,&si,psd,dwSidSize,&dwSdSizeNeeded))
                        {
                              wprintf(L"GetUserObjectSecurity() failed, error %d\n", GetLastError());
                              __leave;
                        }
                  }
                  else
                        __leave;
            }
            else
                  wprintf(L"GetUserObjectSecurity() should be OK!\n");
           
            // Create a new security descriptor
            if (!InitializeSecurityDescriptor(psdNew,SECURITY_DESCRIPTOR_REVISION))
            {
                  wprintf(L"InitializeSecurityDescriptor() failed, error %d\n", GetLastError());
                  __leave;
            }
           
            // Obtain the DACL from the security descriptor
            if (!GetSecurityDescriptorDacl(psd,&bDaclPresent,&pacl,&bDaclExist))
            {
                  wprintf(L"GetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
           
            // Initialize
            ZeroMemory(&aclSizeInfo, sizeof(ACL_SIZE_INFORMATION));
            aclSizeInfo.AclBytesInUse = sizeof(ACL);
            // Call only if NULL DACL
            if (pacl != NULL)
            {
                  // Determine the size of the ACL information
                  if (!GetAclInformation(pacl,(LPVOID)&aclSizeInfo,sizeof(ACL_SIZE_INFORMATION),AclSizeInformation))
                  {
                        wprintf(L"GetAclInformation() failed, error %d\n", GetLastError());
                        __leave;
                  }
            }
           
            // Compute the size of the new ACL
            dwNewAclSize = aclSizeInfo.AclBytesInUse + sizeof(ACCESS_ALLOWED_ACE) + GetLengthSid(psid) - sizeof(DWORD);           
            // Allocate buffer for the new ACL
            pNewAcl = (PACL)HeapAlloc(GetProcessHeap(),HEAP_ZERO_MEMORY,dwNewAclSize);
           
            if (pNewAcl == NULL)
                  __leave;
            // Initialize the new ACL
            if (!InitializeAcl(pNewAcl, dwNewAclSize, ACL_REVISION))
            {
                  wprintf(L"InitializeAcl() failed, error %d\n", GetLastError());
                  __leave;
            }
            // If DACL is present, copy it to a new DACL
            if (bDaclPresent)
            {
                  // Copy the ACEs to the new ACL.
                  if (aclSizeInfo.AceCount)
                  {
                        for (i=0; i < aclSizeInfo.AceCount; i++)
                        {
                              // Get an ACE.
                              if (!GetAce(pacl, i, reinterpret_cast<void**>(&pTempAce)))
                              {
                                    wprintf(L"GetAce() failed, error %d\n", GetLastError());
                                    __leave;
                              }
                              else
                                    wprintf(L"GetAce() should be fine!\n");
 
                              if (!EqualSid( psid, &pTempAce->SidStart))
                              {
                                    // Add the ACE to the new ACL.
                                    if (!AddAce(pNewAcl,ACL_REVISION,MAXDWORD,pTempAce,((PACE_HEADER)pTempAce)->AceSize))
                                    {
                                          wprintf(L"AddAce() failed, error %d\n", GetLastError());
                                          __leave;
                                    }
                                    else
                                          wprintf(L"AddAce() should be fine!\n");
                              }
                              else
                                    wprintf(L"EqualSid() should be fine!\n");
                        }
                  }
            }
           
            // Set new DACL to the new security descriptor
            if (!SetSecurityDescriptorDacl(psdNew,TRUE,pNewAcl,FALSE))
            {
                  wprintf(L"SetSecurityDescriptorDacl() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"SetSecurityDescriptorDacl() is pretty fine!\n");
 
            // Set the new security descriptor for the desktop object
            if (!SetUserObjectSecurity(hdesk, &si, psdNew))
            {
                  wprintf(L"SetUserObjectSecurity() failed, error %d\n", GetLastError());
                  __leave;
            }
            else
                  wprintf(L"SetUserObjectSecurity() is pretty fine!\n");
 
            // Indicate success
            bSuccess = TRUE;
      }
      __finally
      {
            // Free buffers
            if(pacl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pacl);
            if (pNewAcl != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)pNewAcl);
            if (psd != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psd);
            if (psdNew != NULL)
                  HeapFree(GetProcessHeap(), 0, (LPVOID)psdNew);
      }
      return bSuccess;
}