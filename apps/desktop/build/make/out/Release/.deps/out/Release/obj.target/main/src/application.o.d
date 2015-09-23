cmd_out/Release/obj.target/main/src/application.o := c++ '-DEXPAT_RELATIVE_PATH' '-DFEATURE_ENABLE_VOICEMAIL' '-DGTEST_RELATIVE_PATH' '-DJSONCPP_RELATIVE_PATH' '-DLOGGING=1' '-DSRTP_RELATIVE_PATH' '-DFEATURE_ENABLE_SSL' '-DFEATURE_ENABLE_PSTN' '-DHAVE_SCTP' '-DHAVE_SRTP' '-DHAVE_WEBRTC_VIDEO' '-DHAVE_WEBRTC_VOICE' '-DWEBRTC_POSIX' '-DWEBRTC_MAC' '-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' '-DOSX' '-DCARBON_DEPRECATED=YES' '-DHASH_NAMESPACE=__gnu_cxx' '-DDISABLE_DYNAMIC_CAST' '-D_REENTRANT' '-DNDEBUG' -I../../. -I../../vendor/webrtc-build-scripts/ios/webrtc/src -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc -I../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include -I../../vendor/jsoncpp/include  -fasm-blocks -mpascal-strings -O3 -mmacosx-version-min=10.5 -arch x86_64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=c++11 -fno-rtti -fvisibility-inlines-hidden -fno-strict-aliasing -MMD -MF out/Release/.deps/out/Release/obj.target/main/src/application.o.d.raw  -c -o out/Release/obj.target/main/src/application.o ../../src/application.cc
out/Release/obj.target/main/src/application.o: ../../src/application.cc \
  ../../src/./application.h ../../src/./core/base/application.h \
  ../../src/./core/base/../log/logger.h \
  ../../src/./core/base/../mesh/mesh.h \
  ../../src/./core/base/../mesh/./bus.h \
  ../../src/./core/base/../mesh/./request.h \
  ../../src/./core/base/../mesh/./response.h \
  ../../src/./core/base/../mesh/../thread/thread.h \
  ../../src/./core/base/../mesh/../thread/condition.h \
  ../../src/./core/base/../mesh/../thread/mutex.h \
  ../../src/./core/base/../mesh/../thread/runnable.h \
  ../../src/./core/base/../mesh/./accept.h \
  ../../src/./core/base/../mesh/./reject.h \
  ../../src/./core/base/../mesh/./commands.h \
  ../../src/./core/base/../mesh/./fn.h \
  ../../src/./core/base/../mesh/./sequence.h \
  ../../src/./commands/commands.h \
  ../../src/./commands/../core/mesh/mesh.h \
  ../../src/./commands/../core/events/event_listener.h \
  ../../src/./commands/../core/events/./event.h \
  ../../src/./core/io/console.h ../../src/./core/io/./base.h \
  ../../src/./core/io/../mesh/mesh.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h \
  ../../src/./osx/desktop.h ../../src/./osx/../base/desktop.h \
  ../../src/./osx/../base/./window.h \
  ../../src/./osx/../base/../geom/bounds.h \
  ../../src/./osx/../base/../graphics/bitmap.h
../../src/application.cc:
../../src/./application.h:
../../src/./core/base/application.h:
../../src/./core/base/../log/logger.h:
../../src/./core/base/../mesh/mesh.h:
../../src/./core/base/../mesh/./bus.h:
../../src/./core/base/../mesh/./request.h:
../../src/./core/base/../mesh/./response.h:
../../src/./core/base/../mesh/../thread/thread.h:
../../src/./core/base/../mesh/../thread/condition.h:
../../src/./core/base/../mesh/../thread/mutex.h:
../../src/./core/base/../mesh/../thread/runnable.h:
../../src/./core/base/../mesh/./accept.h:
../../src/./core/base/../mesh/./reject.h:
../../src/./core/base/../mesh/./commands.h:
../../src/./core/base/../mesh/./fn.h:
../../src/./core/base/../mesh/./sequence.h:
../../src/./commands/commands.h:
../../src/./commands/../core/mesh/mesh.h:
../../src/./commands/../core/events/event_listener.h:
../../src/./commands/../core/events/./event.h:
../../src/./core/io/console.h:
../../src/./core/io/./base.h:
../../src/./core/io/../mesh/mesh.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h:
../../src/./osx/desktop.h:
../../src/./osx/../base/desktop.h:
../../src/./osx/../base/./window.h:
../../src/./osx/../base/../geom/bounds.h:
../../src/./osx/../base/../graphics/bitmap.h:
