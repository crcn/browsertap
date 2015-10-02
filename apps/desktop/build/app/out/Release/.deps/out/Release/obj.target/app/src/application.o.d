cmd_out/Release/obj.target/app/src/application.o := c++ '-DEXPAT_RELATIVE_PATH' '-DFEATURE_ENABLE_VOICEMAIL' '-DGTEST_RELATIVE_PATH' '-DJSONCPP_RELATIVE_PATH' '-DLOGGING=1' '-DSRTP_RELATIVE_PATH' '-DFEATURE_ENABLE_SSL' '-DFEATURE_ENABLE_PSTN' '-DHAVE_SCTP' '-DHAVE_SRTP' '-DHAVE_WEBRTC_VIDEO' '-DHAVE_WEBRTC_VOICE' '-DWEBRTC_POSIX' '-DWEBRTC_MAC' '-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' '-DOSX' '-DCARBON_DEPRECATED=YES' '-DHASH_NAMESPACE=__gnu_cxx' '-DDISABLE_DYNAMIC_CAST' '-D_REENTRANT' '-DNDEBUG' -I../../. -I../../vendor/webrtc-build-scripts/ios/webrtc/src -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc -I../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include -I../../vendor/libwebsockets/lib -I../../vendor/libwebsockets/build -I../../vendor/jsoncpp/include  -fasm-blocks -mpascal-strings -O3 -mmacosx-version-min=10.5 -arch x86_64 -Wall -Wendif-labels -W -Wno-unused-parameter -Wall -Wendif-labels -W -Wno-unused-parameter -std=c++11 -fno-rtti -fvisibility-inlines-hidden -fno-strict-aliasing -fno-strict-aliasing -MMD -MF out/Release/.deps/out/Release/obj.target/app/src/application.o.d.raw  -c -o out/Release/obj.target/app/src/application.o ../../src/application.cc
out/Release/obj.target/app/src/application.o: ../../src/application.cc \
  ../../src/./application.h ../../src/./core/active_record/db.h \
  ../../src/./core/active_record/../application/application.h \
  ../../src/./core/active_record/../application/../log/logger.h \
  ../../src/./core/active_record/../application/../mesh/mesh.h \
  ../../src/./core/active_record/../application/../mesh/./bus.h \
  ../../src/./core/active_record/../application/../mesh/./request.h \
  ../../src/./core/active_record/../application/../mesh/./response.h \
  ../../src/./core/active_record/../application/../mesh/../thread/thread.h \
  ../../src/./core/active_record/../application/../mesh/../thread/./runnable.h \
  ../../src/./core/active_record/../application/../mesh/../thread/condition.h \
  ../../src/./core/active_record/../application/../mesh/../thread/mutex.h \
  ../../src/./core/active_record/../application/../mesh/./accept.h \
  ../../src/./core/active_record/../application/../mesh/./reject.h \
  ../../src/./core/active_record/../application/../mesh/./commands.h \
  ../../src/./core/active_record/../application/../mesh/./fn.h \
  ../../src/./core/active_record/../application/../mesh/./sequence.h \
  ../../src/./core/active_record/../application/../mesh/./resp.h \
  ../../src/./core/active_record/../application/../thread/manager.h \
  ../../src/./core/active_record/../application/../mesh/../thread/./task.h \
  ../../src/./core/active_record/../application/../mesh/../thread/./worker.h \
  ../../src/./core/active_record/./collection.h \
  ../../src/./core/active_record/../events/event_emitter.h \
  ../../src/./core/active_record/../events/./event_listener.h \
  ../../src/./core/active_record/../events/./event.h \
  ../../src/./core/active_record/./events.h \
  ../../src/./core/active_record/./object.h \
  ../../src/./core/active_record/../json/serializeable.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h \
  ../../src/./core/io/console.h ../../src/./core/io/./base.h \
  ../../src/./core/io/../mesh/mesh.h ../../src/./core/virt/osx/desktop.h \
  ../../src/./core/virt/osx/../base/desktop.h \
  ../../src/./core/virt/osx/../base/./window.h \
  ../../src/./core/virt/osx/../base/../../geom/bounds.h \
  ../../src/./core/virt/osx/../base/../../graphics/printable.h \
  ../../src/./core/virt/osx/../base/../../graphics/./bitmap.h \
  ../../src/./commands/commands.h \
  ../../src/./commands/../core/mesh/mesh.h \
  ../../src/./core/io/websockets.h \
  ../../vendor/libwebsockets/lib/libwebsockets.h \
  ../../vendor/libwebsockets/build/lws_config.h \
  ../../src/./plugins/log_operations.h \
  ../../src/./plugins/../core/mesh/mesh.h
../../src/application.cc:
../../src/./application.h:
../../src/./core/active_record/db.h:
../../src/./core/active_record/../application/application.h:
../../src/./core/active_record/../application/../log/logger.h:
../../src/./core/active_record/../application/../mesh/mesh.h:
../../src/./core/active_record/../application/../mesh/./bus.h:
../../src/./core/active_record/../application/../mesh/./request.h:
../../src/./core/active_record/../application/../mesh/./response.h:
../../src/./core/active_record/../application/../mesh/../thread/thread.h:
../../src/./core/active_record/../application/../mesh/../thread/./runnable.h:
../../src/./core/active_record/../application/../mesh/../thread/condition.h:
../../src/./core/active_record/../application/../mesh/../thread/mutex.h:
../../src/./core/active_record/../application/../mesh/./accept.h:
../../src/./core/active_record/../application/../mesh/./reject.h:
../../src/./core/active_record/../application/../mesh/./commands.h:
../../src/./core/active_record/../application/../mesh/./fn.h:
../../src/./core/active_record/../application/../mesh/./sequence.h:
../../src/./core/active_record/../application/../mesh/./resp.h:
../../src/./core/active_record/../application/../thread/manager.h:
../../src/./core/active_record/../application/../mesh/../thread/./task.h:
../../src/./core/active_record/../application/../mesh/../thread/./worker.h:
../../src/./core/active_record/./collection.h:
../../src/./core/active_record/../events/event_emitter.h:
../../src/./core/active_record/../events/./event_listener.h:
../../src/./core/active_record/../events/./event.h:
../../src/./core/active_record/./events.h:
../../src/./core/active_record/./object.h:
../../src/./core/active_record/../json/serializeable.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h:
../../src/./core/io/console.h:
../../src/./core/io/./base.h:
../../src/./core/io/../mesh/mesh.h:
../../src/./core/virt/osx/desktop.h:
../../src/./core/virt/osx/../base/desktop.h:
../../src/./core/virt/osx/../base/./window.h:
../../src/./core/virt/osx/../base/../../geom/bounds.h:
../../src/./core/virt/osx/../base/../../graphics/printable.h:
../../src/./core/virt/osx/../base/../../graphics/./bitmap.h:
../../src/./commands/commands.h:
../../src/./commands/../core/mesh/mesh.h:
../../src/./core/io/websockets.h:
../../vendor/libwebsockets/lib/libwebsockets.h:
../../vendor/libwebsockets/build/lws_config.h:
../../src/./plugins/log_operations.h:
../../src/./plugins/../core/mesh/mesh.h:
