all: ./vendor/webrtc-build-scripts link app app_test

app: ./build/app ./build/xcodefiles ./build/app2/out/Release/main

app_test: ./build/app_test ./build/app_test2/out/Release/main

test-app: app_test 
	./build/app_test/out/Release/app_test

link:
	mkdir -p /usr/local/bt;
	rm /usr/local/bt/remote-desktop-server;
	ln -s `pwd` /usr/local/bt/remote-desktop-server

./vendor/webrtc-build-scripts:
	./scripts/get_and_build_webrtc.sh

./build/app:
	vendor/gyp/gyp remote_desktop_server.gyp --depth=. -f make --generator-output=./build/app

./build/app_test:
	vendor/gyp/gyp tests.gyp --depth=. -f make --generator-output=./build/app_test

./build/xcodefiles:
	vendor/gyp/gyp remote_desktop_server.gyp --depth=. -f xcode --generator-output=./build/xcodefiles

./build/app2/out/Release/main: ./build/app
	make -C ./build/app V=1

./build/app_test2/out/Release/main: ./build/app_test
	make -C ./build/app_test V=1

clean: clean-build

clean-build:
	rm -rf ./build
