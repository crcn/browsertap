# rm -rf ./vendor/depot_tools ./vendor/src ./vendor/.gclient* ./vendor/webrtc ./vendor/_gclient*
mkdir -p ./vendor/depot_tools;
cd ./vendor;
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git;
mkdir -p ./webrtc;
cd ./webrtc;
../depot_tools/fetch --nohooks webrtc
cd ./src;
python webrtc/build/gyp_webrtc;
../../depot_tools/ninja -C ./out/Debug;
../../depot_tools/ninja -C ./out/Release;
