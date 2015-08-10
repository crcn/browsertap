function build_iossim() {
  echo "-- building WebRTC for the iOS simulator"
  export GYP_GENERATORS="ninja"
  export GYP_DEFINES="build_with_libjingle=1 build_with_chromium=0 libjingle_objc=1 OS=ios target_arch=ia32"
  export GYP_GENERATOR_FLAGS="$GYP_GENERATOR_FLAGS output_dir=out_ios"
  export GYP_CROSSCOMPILE=1
  pushd src
  gclient runhooks
  ninja -C out_ios/Release-iphonesimulator iossim AppRTCDemo
  popd
}
 
function build_iosdevice() {
  echo "-- building WebRTC for iOS devices"
  export GYP_GENERATORS="ninja"
  export GYP_DEFINES="build_with_libjingle=1 build_with_chromium=0 libjingle_objc=1 OS=ios target_arch=armv7"
  export GYP_GENERATOR_FLAGS="$GYP_GENERATOR_FLAGS output_dir=out_ios"
  export GYP_CROSSCOMPILE=1
  pushd src
  gclient runhooks
  ninja -C out_ios/Release-iphoneos AppRTCDemo
  popd
}
 
function combine_libs() {
  echo "-- combining libraries"
  libtool -static -o src/out_ios/Release-iphonesimulator/libWebRTC-sim.a src/out_ios/Release-iphonesimulator/*.a
  strip -S -x -o src/out_ios/Release-iphonesimulator/libWebRTC-sim-min.a -r src/out_ios/Release-iphonesimulator/libWebRTC-sim.a
  libtool -static -o src/out_ios/Release-iphoneos/libWebRTC-ios.a src/out_ios/Release-iphoneos/*.a
  strip -S -x -o src/out_ios/Release-iphoneos/libWebRTC-ios-min.a -r src/out_ios/Release-iphoneos/libWebRTC-ios.a
  lipo -create src/out_ios/Release-iphonesimulator/libWebRTC-sim-min.a src/out_ios/Release-iphoneos/libWebRTC-ios-min.a -output libWebRTC.a
  echo "The public headers are located in ./src/talk/app/webrtc/objc/public/*.h"
}
 
function build_all() {
  build_iossim && build_iosdevice && combine_libs
}
 
function run_simulator() {
  echo "-- running webrtc appdemo on iOS simulator"
  src/out_ios/Release-iphonesimulator/iossim src/out_ios/Release-iphonesimulator/AppRTCDemo.app
}
 
function run_on_device() {
  echo "-- launching on device"
  ideviceinstaller -i src/out_ios/Release-iphoneos/AppRTCDemo.app
  echo "-- launch complete"
}
 
# Run the function specified by the first parameter on the command line
$@