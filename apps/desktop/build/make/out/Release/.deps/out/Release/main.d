cmd_out/Release/main := c++ -Wl,-dead_strip -mmacosx-version-min=10.5 -arch x86_64 -Lout/Release  -o "out/Release/main" out/Release/obj.target/main/src/main.o out/Release/obj.target/main/src/osx/window.o out/Release/obj.target/main/src/osx/desktop.o out/Release/obj.target/main/src/remote/server.o out/Release/obj.target/main/src/remote/peer.o out/Release/obj.target/main/src/remote/core.o out/Release/obj.target/main/src/core/event_emitter.o /usr/local/bt/remote-desktop-server/vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds/libWebRTC-9725-mac-x86_64-Release.a -framework AudioToolbox -framework AudioUnit -framework CoreAudio -framework CoreVideo -framework OpenGL -framework QTKit -framework AppKit -framework Foundation