# TODO - add conditional stuff here so that stuff here so that we can re-run this script
# in the meantime, comment out the commands you don't wanna run

# http://www.webrtc.org/native-code/development
# http://ninjanetic.com/how-to-get-started-with-webrtc-and-ios-without-wasting-10-hours-of-your-life/
export PATH=/opt/depot_tools:"$PATH"
rm -rf ./vendor/webrtc; # TODO - remove this when condition stuff is here
mkdir -p ./vendor/webrtc;
#git clone https://chromium.googlesource.com/external/webrtc ./vendor/webrtc;
cd ./vendor/webrtc;
gclient config --name src https://chromium.googlesource.com/external/webrtc
gclient sync --force;
echo "target_os = ['mac']" >> .gclient # appends to gclient - needed for mac clients otherwise errors occur
cd src;

# gclient runhooks;
python webrtc/build/gyp_webrtc;
ninja -C out/Debug;
ninja -C out/Release;
