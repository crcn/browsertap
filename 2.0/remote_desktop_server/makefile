all: ./vendor/webrtc-build-scripts ./build ./build/out/Release/main

./vendor/webrtc-build-scripts:
	./scripts/get_and_build_webrtc.sh


./build:
	vendor/gyp/gyp remote_desktop_server.gyp --depth=. -f make --generator-output=./build

./build/out/Release/main: ./build/
	make -C ./build V=1

clean: clean-build

clean-build:
	rm ./build/out/Release/main
