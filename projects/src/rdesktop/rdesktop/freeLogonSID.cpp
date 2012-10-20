#include "stdafx.h"
#include <windows.h>
#pragma comment(lib, "advapi32.lib")

VOID FreeLogonSID (PSID *ppsid) 
{
    HeapFree(GetProcessHeap(), 0, (LPVOID)*ppsid);
}
