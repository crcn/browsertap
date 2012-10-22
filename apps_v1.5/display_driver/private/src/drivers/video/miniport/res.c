typedef struct {
	LPWSTR path;
	HKEY key;
} REG_HANDLE;

REG_HANDLE openReg(LPWSTR path) 
{
	HKEY key;

	if(RegOpenKey(HKEY_CURRENT_USER, path, &key) != ERROR_SUCCESS) 
	{
		RegCreateKey(HKEY_CURRENT_USER, path, &key);
	}

	REG_HANDLE handle = { path, key };

	return handle;
}

bool closeReg(REG_HANDLE handle)
{
	RegCloseKey(handle.key);
	return true;
}

int setIntValue(REG_HANDLE handle, LPWSTR name, int value)
{
	WCHAR buffer[50] = { 0 };	
	_itow(value, buffer, 10);

	if(RegSetValueEx(handle.key, name, 0, REG_SZ, (LPBYTE)buffer, (std::wcslen(buffer) + 1) * sizeof(WCHAR)) != ERROR_SUCCESS) 
	{
	}

	return value;
}

int getIntValue(REG_HANDLE handle, LPWSTR name, int defaultValue) 
{
	
	WCHAR buffer[50] = { 0 };
	DWORD BufferSize = 8192;

	if(RegGetValue(HKEY_CURRENT_USER, 
		handle.path,
		name, 
		RRF_RT_ANY, 
		NULL, 
		(PVOID)&buffer, 
		&BufferSize) == ERROR_SUCCESS)
	{
		int wlen = wcslen(buffer);
		char* chr = (char*)malloc((wlen + 1) * sizeof(char));
		chr[wlen] = '\0';
		wcstombs(chr, buffer, wlen);
		

		int value = atoi(chr);
		free(chr);

		if(!!value)
		{
			return value;
		}
	}

	return setIntValue(handle, name, defaultValue);
}