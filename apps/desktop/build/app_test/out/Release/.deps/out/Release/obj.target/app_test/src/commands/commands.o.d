cmd_out/Release/obj.target/app_test/src/commands/commands.o := c++ '-DEXPAT_RELATIVE_PATH' '-DFEATURE_ENABLE_VOICEMAIL' '-DGTEST_RELATIVE_PATH' '-DJSONCPP_RELATIVE_PATH' '-DLOGGING=1' '-DSRTP_RELATIVE_PATH' '-DFEATURE_ENABLE_SSL' '-DFEATURE_ENABLE_PSTN' '-DHAVE_SCTP' '-DHAVE_SRTP' '-DHAVE_WEBRTC_VIDEO' '-DHAVE_WEBRTC_VOICE' '-DWEBRTC_POSIX' '-DWEBRTC_MAC' '-DWEBRTC_INCLUDE_INTERNAL_AUDIO_DEVICE' '-DOSX' '-DCARBON_DEPRECATED=YES' '-DHASH_NAMESPACE=__gnu_cxx' '-DDISABLE_DYNAMIC_CAST' '-D_REENTRANT' '-DNDEBUG' -I../../vendor -I../../vendor/gtest/include -I../../vendor/gtest -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include -I../../vendor/libwebsockets/lib -I../../vendor/libwebsockets/build -I../../vendor/jsoncpp/include -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include -I../../vendor/libwebsockets/lib -I../../vendor/libwebsockets/build -I../../vendor/jsoncpp/include -I../../. -I../../vendor/webrtc-build-scripts/ios/webrtc/src -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party -I../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/webrtc -I../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc  -fasm-blocks -mpascal-strings -O3 -mmacosx-version-min=10.5 -arch x86_64 -Wall -Wendif-labels -W -Wno-unused-parameter -Wall -Wendif-labels -W -Wno-unused-parameter -std=c++11 -fno-rtti -fvisibility-inlines-hidden -fno-strict-aliasing -fno-strict-aliasing -MMD -MF out/Release/.deps/out/Release/obj.target/app_test/src/commands/commands.o.d.raw  -c -o out/Release/obj.target/app_test/src/commands/commands.o ../../src/commands/commands.cc
out/Release/obj.target/app_test/src/commands/commands.o: \
  ../../src/commands/commands.cc ../../src/commands/./commands.h \
  ../../src/commands/../application.h \
  ../../src/commands/.././core/active_record/db.h \
  ../../src/commands/.././core/active_record/../application/application.h \
  ../../src/commands/.././core/active_record/../application/../log/logger.h \
  ../../src/commands/.././core/active_record/../application/../mesh/mesh.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./bus.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./request.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./response.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/thread.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/./runnable.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/condition.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/mutex.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./accept.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./reject.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./commands.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./fn.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./sequence.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./resp.h \
  ../../src/commands/.././core/active_record/../application/../mesh/./tailable.h \
  ../../src/commands/.././core/active_record/../application/../thread/manager.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/./task.h \
  ../../src/commands/.././core/active_record/../application/../mesh/../thread/./worker.h \
  ../../src/commands/.././core/active_record/./collection.h \
  ../../src/commands/.././core/active_record/../events/event_emitter.h \
  ../../src/commands/.././core/active_record/../events/./event_listener.h \
  ../../src/commands/.././core/active_record/../events/./event.h \
  ../../src/commands/.././core/active_record/./events.h \
  ../../src/commands/.././core/active_record/./object.h \
  ../../src/commands/.././core/active_record/../json/serializeable.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h \
  ../../src/commands/.././core/io/console.h \
  ../../src/commands/.././core/io/./base.h \
  ../../src/commands/.././core/io/../mesh/mesh.h \
  ../../src/commands/.././core/virt/osx/desktop.h \
  ../../src/commands/.././core/virt/osx/../base/desktop.h \
  ../../src/commands/.././core/virt/osx/../base/./window.h \
  ../../src/commands/.././core/virt/osx/../base/../../geom/bounds.h \
  ../../src/commands/.././core/virt/osx/../base/../../graphics/printable.h \
  ../../src/commands/.././core/virt/osx/../base/../../graphics/./bitmap.h \
  ../../src/commands/.././plugins/log_operations.h \
  ../../src/commands/../core/mesh/mesh.h \
  ../../src/commands/../core/wrtc/connection.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videosourceinterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/mediastreaminterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/basictypes.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/constructormagic.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/refcount.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/atomicops.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/scoped_ref_ptr.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediachannel.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/codec.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/constants.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/streamparams.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/buffer.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/scoped_ptr.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/template_util.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/typedefs.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/dscp.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/logging.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/criticalsection.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_annotations.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sigslot.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socket.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketaddress.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ipaddress.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/byteorder.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/window.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stringencode.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/checks.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/audiomonitor.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/port.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/candidate.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/constants.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/helpers.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/network.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagehandler.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/packetsocketfactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/proxyinfo.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/cryptstring.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/linked_ptr.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/portinterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transport.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/sessiondescription.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportinfo.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportdescription.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslfingerprint.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslidentity.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagedigest.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagequeue.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketserver.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketfactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncsocket.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/common.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/timeutils.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslstreamadapter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stream.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/stun.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/bytebuffer.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/stunrequest.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/event.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncpacketsocket.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ratetracker.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectionfactoryproxy.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectioninterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/datachannelinterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/dtlsidentitystore.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/dtmfsenderinterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsep.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/statstypes.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_checker.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_checker_impl.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/platform_thread.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/umametrics.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/fileutils.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/platform_file.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/proxy.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/bind.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/json.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ssladapter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stringutils.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsepsessiondescription.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsepicecandidate.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/mediaconstraintsinterface.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectionfactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/channelmanager.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/capturemanager.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/capturerenderadapter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocapturer.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoadapter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocommon.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoframefactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoframe.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/common_video/interface/video_frame_buffer.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/callback.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/system_wrappers/interface/aligned_malloc.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/common_video/rotation.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/devices/devicemanager.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/device.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/screencastid.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/windowpicker.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocapturerfactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/rollingaccumulator.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/timing.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sigslotrepeater.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediaengine.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediacommon.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoprocessor.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/voiceprocessor.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/session.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/voicechannel.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/channel.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/client/socketmonitor.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/bundlefilter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/mediamonitor.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/mediasession.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/cryptoparams.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportdescriptionfactory.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/rtcpmuxfilter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/srtpfilter.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncudpsocket.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/test/fakeconstraints.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videosource.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/notifier.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videotrackrenderers.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videorenderer.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/sctp/sctpdataengine.h \
  ../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/webrtc/webrtcvideocapturerfactory.h \
  ../../src/commands/../core/wrtc/./core.h \
  ../../src/commands/../core/wrtc/./observers.h \
  ../../src/commands/../core/wrtc/./session_description.h \
  ../../src/commands/../active_records/wrtc_connection.h \
  ../../src/commands/../active_records/./virt_window.h \
  ../../src/commands/./create_wrtc_connection_response.h \
  ../../src/commands/../core/json/chunk.h
../../src/commands/commands.cc:
../../src/commands/./commands.h:
../../src/commands/../application.h:
../../src/commands/.././core/active_record/db.h:
../../src/commands/.././core/active_record/../application/application.h:
../../src/commands/.././core/active_record/../application/../log/logger.h:
../../src/commands/.././core/active_record/../application/../mesh/mesh.h:
../../src/commands/.././core/active_record/../application/../mesh/./bus.h:
../../src/commands/.././core/active_record/../application/../mesh/./request.h:
../../src/commands/.././core/active_record/../application/../mesh/./response.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/thread.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/./runnable.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/condition.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/mutex.h:
../../src/commands/.././core/active_record/../application/../mesh/./accept.h:
../../src/commands/.././core/active_record/../application/../mesh/./reject.h:
../../src/commands/.././core/active_record/../application/../mesh/./commands.h:
../../src/commands/.././core/active_record/../application/../mesh/./fn.h:
../../src/commands/.././core/active_record/../application/../mesh/./sequence.h:
../../src/commands/.././core/active_record/../application/../mesh/./resp.h:
../../src/commands/.././core/active_record/../application/../mesh/./tailable.h:
../../src/commands/.././core/active_record/../application/../thread/manager.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/./task.h:
../../src/commands/.././core/active_record/../application/../mesh/../thread/./worker.h:
../../src/commands/.././core/active_record/./collection.h:
../../src/commands/.././core/active_record/../events/event_emitter.h:
../../src/commands/.././core/active_record/../events/./event_listener.h:
../../src/commands/.././core/active_record/../events/./event.h:
../../src/commands/.././core/active_record/./events.h:
../../src/commands/.././core/active_record/./object.h:
../../src/commands/.././core/active_record/../json/serializeable.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/json.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/autolink.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/config.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/value.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/forwards.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/reader.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/features.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include/json/writer.h:
../../src/commands/.././core/io/console.h:
../../src/commands/.././core/io/./base.h:
../../src/commands/.././core/io/../mesh/mesh.h:
../../src/commands/.././core/virt/osx/desktop.h:
../../src/commands/.././core/virt/osx/../base/desktop.h:
../../src/commands/.././core/virt/osx/../base/./window.h:
../../src/commands/.././core/virt/osx/../base/../../geom/bounds.h:
../../src/commands/.././core/virt/osx/../base/../../graphics/printable.h:
../../src/commands/.././core/virt/osx/../base/../../graphics/./bitmap.h:
../../src/commands/.././plugins/log_operations.h:
../../src/commands/../core/mesh/mesh.h:
../../src/commands/../core/wrtc/connection.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videosourceinterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/mediastreaminterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/basictypes.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/constructormagic.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/refcount.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/atomicops.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/scoped_ref_ptr.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediachannel.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/codec.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/constants.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/streamparams.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/buffer.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/scoped_ptr.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/template_util.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/typedefs.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/dscp.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/logging.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/criticalsection.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_annotations.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sigslot.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socket.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketaddress.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ipaddress.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/byteorder.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/window.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stringencode.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/checks.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/audiomonitor.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/port.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/candidate.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/constants.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/helpers.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/network.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagehandler.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/packetsocketfactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/proxyinfo.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/cryptstring.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/linked_ptr.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/portinterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transport.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/sessiondescription.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportinfo.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportdescription.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslfingerprint.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslidentity.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagedigest.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/messagequeue.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketserver.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/socketfactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncsocket.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/common.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/timeutils.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sslstreamadapter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stream.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/stun.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/bytebuffer.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/stunrequest.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/event.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncpacketsocket.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ratetracker.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectionfactoryproxy.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectioninterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/datachannelinterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/dtlsidentitystore.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/dtmfsenderinterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsep.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/statstypes.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_checker.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/thread_checker_impl.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/platform_thread.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/umametrics.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/fileutils.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/platform_file.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/proxy.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/bind.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/json.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/ssladapter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/stringutils.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsepsessiondescription.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/jsepicecandidate.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/mediaconstraintsinterface.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/peerconnectionfactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/channelmanager.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/capturemanager.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/capturerenderadapter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocapturer.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoadapter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocommon.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoframefactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoframe.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/common_video/interface/video_frame_buffer.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/callback.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/system_wrappers/interface/aligned_malloc.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/common_video/rotation.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/devices/devicemanager.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/device.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/screencastid.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/windowpicker.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videocapturerfactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/rollingaccumulator.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/timing.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/sigslotrepeater.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediaengine.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/mediacommon.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videoprocessor.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/voiceprocessor.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/session.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/voicechannel.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/channel.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/client/socketmonitor.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/bundlefilter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/mediamonitor.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/mediasession.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/cryptoparams.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/p2p/base/transportdescriptionfactory.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/rtcpmuxfilter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/session/media/srtpfilter.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/base/asyncudpsocket.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/test/fakeconstraints.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videosource.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/notifier.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/app/webrtc/videotrackrenderers.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/base/videorenderer.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/sctp/sctpdataengine.h:
../../vendor/webrtc-build-scripts/ios/webrtc/src/talk/media/webrtc/webrtcvideocapturerfactory.h:
../../src/commands/../core/wrtc/./core.h:
../../src/commands/../core/wrtc/./observers.h:
../../src/commands/../core/wrtc/./session_description.h:
../../src/commands/../active_records/wrtc_connection.h:
../../src/commands/../active_records/./virt_window.h:
../../src/commands/./create_wrtc_connection_response.h:
../../src/commands/../core/json/chunk.h:
