cmd_out/Release/app := c++ -Wl,-dead_strip -mmacosx-version-min=10.5 -arch x86_64 -Lout/Release  -o "out/Release/app" out/Release/obj.target/app/src/application.o out/Release/obj.target/app/src/commands/commands.o out/Release/obj.target/app/src/active_records/wrtc_connection.o out/Release/obj.target/app/src/active_records/virt_window.o out/Release/obj.target/app/src/plugins/log_operations.o out/Release/obj.target/app/src/core/wrtc/connection.o out/Release/obj.target/app/src/core/wrtc/observers.o out/Release/obj.target/app/src/core/wrtc/core.o out/Release/obj.target/app/src/core/wrtc/printable_video_capturer.o out/Release/obj.target/app/src/core/thread/condition.o out/Release/obj.target/app/src/core/thread/mutex.o out/Release/obj.target/app/src/core/thread/thread.o out/Release/obj.target/app/src/core/thread/manager.o out/Release/obj.target/app/src/core/thread/worker.o out/Release/obj.target/app/src/core/active_record/object.o out/Release/obj.target/app/src/core/active_record/collection.o out/Release/obj.target/app/src/core/active_record/db.o out/Release/obj.target/app/src/core/events/event_emitter.o out/Release/obj.target/app/src/core/io/console.o out/Release/obj.target/app/src/core/io/websockets.o out/Release/obj.target/app/src/core/virt/osx/window.o out/Release/obj.target/app/src/core/virt/osx/desktop.o out/Release/obj.target/app/src/main.o /usr/local/bt/remote-desktop-server/vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds/libWebRTC-9725-mac-x86_64-Release.a /usr/local/bt/remote-desktop-server/vendor/libwebsockets/build/lib/libwebsockets.a -lz -framework AudioToolbox -framework AudioUnit -framework CoreAudio -framework CoreVideo -framework OpenGL -framework QTKit -framework AppKit -framework Foundation