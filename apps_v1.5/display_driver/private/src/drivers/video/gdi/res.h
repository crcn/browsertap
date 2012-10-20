typedef struct _REG_HANDLE_{
	LPWSTR path;
	HKEY key;
} REG_HANDLE, *PREG_HANDLE;

REG_HANDLE openReg(LPWSTR path) 
{
	HKEY key;
	REG_HANDLE handle;

	if(RegOpenKeyW(HKEY_CURRENT_USER, path, &key) != ERROR_SUCCESS) 
	{
		RegCreateKeyW(HKEY_CURRENT_USER, path, &key);
	}

	handle.key = key;
	handle.path = path;

	return handle;
}

void closeReg(PREG_HANDLE handle)
{
	RegCloseKey(handle->key);
}

int setIntValue(PREG_HANDLE handle, LPWSTR name, int value)
{
	WCHAR buffer[50] = { 0 };	
	_itow(value, buffer, 10);

	if(RegSetValueExW(handle->key, name, 0, REG_SZ, (LPBYTE)buffer, (wcslen(buffer) + 1) * sizeof(WCHAR)) != ERROR_SUCCESS) 
	{
	}

	return value;
}

int getIntValue(PREG_HANDLE handle, LPWSTR name, int defaultValue) 
{
	
	WCHAR buffer[50] = { 0 };
	DWORD BufferSize = 8192;
	int value, wlen;
	char* chr = NULL;

	if(RegGetValueW(HKEY_CURRENT_USER, 
		handle->path,
		name, 
		RRF_RT_ANY, 
		NULL, 
		(PVOID)&buffer, 
		&BufferSize) == ERROR_SUCCESS)
	{
		wlen = wcslen(buffer);
		chr = (char*)malloc((wlen + 1) * sizeof(char));
		chr[wlen] = '\0';
		wcstombs(chr, buffer, wlen);
		

		value = atoi(chr);
		free(chr);

		if(!!value)
		{
			return value;
		}
	}

	return setIntValue(handle, name, defaultValue);
}