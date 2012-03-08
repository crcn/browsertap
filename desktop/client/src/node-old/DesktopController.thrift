namespace csharp Remote.Tft

struct MouseCommand {
	1: i32 x,
	2: i32 y,
	3: i32 code
}

struct KeyboardCommand {
	1: i32 key,
	2: i32 modifiers,
	3: i32 dwFlags
}

struct RecordContext {
	1: i32 frameFrate = 24,
	2: i32 gopSize    = 12,
	3: i32 bitRate    = 1200000,
	4: i32 left   = 0,
	5: i32 right  = 0,
	6: i32 top    = 0,
	7: i32 bottom = 0
}

struct OpenAppCommand {
	1: string name,
	2: string path,
	3: string arguments,
	4: RecordContext ctx
}


service Desktop {
	void invokeMouse(1: MouseCommand mouse),
	void invokeKeyboard(1: KeyboardCommand keyboard),
	void openProgram(1: OpenAppCommand command),
	void updateRecordContext(1: RecordContext context)
}


