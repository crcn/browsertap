all: ./vendor/webrtc-build-scripts link ./build/make ./build/xcodefiles ./build/out/Release/main

link:
	mkdir -p /usr/local/bt;
	rm /usr/local/bt/remote-desktop-server;
	ln -s `pwd` /usr/local/bt/remote-desktop-server

./vendor/webrtc-build-scripts:
	./scripts/get_and_build_webrtc.sh

./build/make:
	vendor/gyp/gyp remote_desktop_server.gyp --depth=. -f make --generator-output=./build/make

./build/xcodefiles:
	vendor/gyp/gyp remote_desktop_server.gyp --depth=. -f xcode --generator-output=./build/xcodefiles


./build/out/Release/main: ./build/make
	make -C ./build/make V=1

clean: clean-build

clean-build:
	rm -rf ./build
