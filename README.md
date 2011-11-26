### Browser Testing tool

A tool similar to browserstack, and browserify where developers can test websites against different browser engines.


### Features

- in default browser via "test" button. No go-to website.
- over RTMP/RTSP for speed.
	- uses user32 library for capturing application screen - hidden as well
	- uses [ffmpeg](http://www.ffmpeg-csharp.com/) for encoding
	- emulates mouse clicks. see [this](http://homeofcox-cs.blogspot.com/2008/07/c-simulate-mouse-and-keyboard-events.html).
	- passes RTMP packets over [flourine FX](http://www.fluorinefx.com/).
- window chrome is cut out. 
- window chrome resizes to users browser (seamless).
- multiple users can be connected to the same computer. Some to the given session.


also see http://mwinapi.sourceforge.net/

### Technical Features




### Class Architecture

- core
	- user32.cs
- virt
	- `Application.cs` - controls a given Application
		- `Controller(String path)` - constructor
		- `open()` - opens an application
		- `getWindow()` - gets the application window
		- `getNewUser()` - returns a new user (for multiple sessions) 
	- `Window.cs`
		- `print()` - print the given window
		- `setPosition(int X, int Y)` - not needed - should be 0
		- `setSize(int width, int height)` - sets size of the window
		- `setBounds(int X, int Y, int width, int height)`
		- `getMenuItems()` - returns list of menu items (from chrome)
	- `User.cs`
		- `User(Controller appController)`
		- `getMouse()`
		- `getKeyboard()`
	- `Keyboard.cs`
		- `keyDown(String key)`
		- `keyUp(String key)`
	- `Mouse.cs`
		- `leftClick()`
		- `rightClick()`
		- `mouseDown()`
		- `mouseUp()`
		- `mouseMove()`
		- `setPosition(int X, int Y)`
		- `Point getPosition()`