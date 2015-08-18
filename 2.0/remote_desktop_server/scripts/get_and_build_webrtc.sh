rm -rf ./vendor; mkdir -p ./vendor; cd ./vendor;
git clone --depth 1 https://chromium.googlesource.com/external/gyp.git ./gyp
git clone git@github.com:pristineio/webrtc-build-scripts.git
cd vendor;
cd webrtc-build-scripts/ios;
source build.sh;
dance;
get_webrtc 9721
export WEBRTC_DEBUG=true
build_webrtc_mac
