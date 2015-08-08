# http://www.webrtc.org/native-code/development
# http://ninjanetic.com/how-to-get-started-with-webrtc-and-ios-without-wasting-10-hours-of-your-life/
export PATH=/opt/depot_tools:"$PATH"
mkdir -p ./vendor/webrtc;
#git clone https://chromium.googlesource.com/external/webrtc ./vendor/webrtc;
cd ./vendor/webrtc;
gclient config --name src https://chromium.googlesource.com/external/webrtc
gclient sync;
python webrtc/build/gyp_webrtc;
ninja -C out/Debug;
ninja -C out/Release;
