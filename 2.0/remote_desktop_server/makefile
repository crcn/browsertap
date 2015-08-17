all: ./vendor/webrtc ./build ./build/out/Release/main

./vendor/webrtc:
	./scripts/get_and_build_webrtc.sh

./deps/gyp:
	git clone --depth 1 https://chromium.googlesource.com/external/gyp.git ./deps/gyp


./build: ./deps/gyp
	deps/gyp/gyp remote_desktop_server.gyp --depth=. -f make --generator-output=./build


./build/out/Release/main: ./build/
	make -C ./build V=1

clean: clean-build

clean-build:
	rm -rf ./build
