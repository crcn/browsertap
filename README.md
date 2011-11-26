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


### Technical Features