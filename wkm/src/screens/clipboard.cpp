#include "screens/clipboard.h"
#include <Windows.h>
#include <iostream>

namespace Screens 
{

	std::string Clipboard::getValue()
	{
		return this->_currentData;
	}

	void Clipboard::setValue(std::string value)
	{
		this->_currentData = value;

		if(OpenClipboard(NULL)) 
		{
			EmptyClipboard();
			HGLOBAL clipbuffer = GlobalAlloc(GMEM_DDESHARE, value.length() + 1);
			char* buffer = (char*)GlobalLock(clipbuffer);
			strcpy(buffer, value.c_str());
			GlobalUnlock(clipbuffer);
			SetClipboardData(CF_TEXT, clipbuffer);
			CloseClipboard();
		}

	}

	bool Clipboard::hasChanged()
	{

		bool hasChanged = false;
		char* buffer = 0;

		if(OpenClipboard(NULL)) 
		{

			HANDLE hData = GetClipboardData( CF_TEXT );
			buffer = (char*)GlobalLock( hData );
			hasChanged = this->_currentData.compare(buffer) != 0;
			GlobalUnlock( hData );
			CloseClipboard();
		}

		if(hasChanged) {
			this->_currentData = std::string(buffer);
		}


		return hasChanged;
	}
}