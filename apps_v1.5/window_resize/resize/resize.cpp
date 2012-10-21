// resize.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <string>
#include <Windows.h>
#include <iostream>
#include <stdlib.h>


typedef struct _RESOLUTION_ {
	int x;
	int y;
} RESOLUTION, *PRESOLUTION;

BOOL CALLBACK eachWindow(__in HWND hWnd, __in LPARAM lParam)
{
	RESOLUTION *res = (RESOLUTION*)lParam;
	RECT rect;
	if(!IsWindowVisible(hWnd) || !GetWindowRect(hWnd, &rect)) return TRUE;

	int w = rect.right - rect.left;
	int h = rect.bottom - rect.top;

	if(w == 0 || h == 0) return TRUE;
	//std::cout << w << " " << h << std::endl;
	/*std::cout << res->x << std::endl;
	int len = GetWindowTextLength(hWnd);
	if(len == 0) return TRUE;

	TCHAR* buffer = new TCHAR[ len + 1 ];
	memset(buffer, 0, (len + 1) * sizeof(TCHAR));
	GetWindowText(hWnd, buffer, len + 1);

	std::wcout << hWnd << TEXT(": ") << buffer << std::endl;
	delete[] buffer;*/

	MoveWindow(hWnd, 0, 0, res->x, res->y, true);
	
	return TRUE;
}


int main(int argc, const char* argv[])
{
	if(argc != 3) {
		std::cerr << "format: [resolutionX] [resolutionY]" << std::endl;
		return 1;
	}

	int x = atoi(argv[1]);
	int y = atoi(argv[2]);

	RESOLUTION res = { x, y };

	EnumWindows(eachWindow, (LPARAM)&res);

	return 0;
}

