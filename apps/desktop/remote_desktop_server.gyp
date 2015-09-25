{
    'includes': [
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/supplement.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/build/common.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/talk/build/common.gypi',
        './common.gypi',
        './config.gypi'
    ],
    'make_global_settings': [

    ['CXX', '/usr/bin/clang'],
    ['LINK', '/usr/bin/clang++']
      ],

    'conditions': [
        ['OS=="mac"', {
            'targets': [{
                'target_name': 'main',
                'type': 'executable',
                'sources': [

                    './src/main.cc',
                    './src/application.cc',
                    './src/commands/commands.cc',

                    './src/core/virt/osx/window.cc',
                    './src/core/virt/osx/desktop.cc',

                    './src/core/wrtc/connection.cc',
                    './src/core/wrtc/observers.cc',
                    './src/core/wrtc/core.cc',

                    './src/core/thread/condition.cc',
                    './src/core/thread/mutex.cc',
                    './src/core/thread/thread.cc',

                    './src/core/do/object.cc',
                    './src/core/do/collection.cc',
                    './src/core/do/dob.cc',

                    './src/core/events/event_emitter.cc',
                    './src/core/io/console.cc',
                    './src/core/io/websockets.cc'
                ],

                'link_settings': {
                    'libraries': [
                        '/usr/local/bt/remote-desktop-server/vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds/libWebRTC-9725-mac-x86_64-Release.a',
                        '/usr/local/bt/remote-desktop-server/vendor/libwebsockets/build/lib/libwebsockets.a',
                        '-lz',
                        '$(SDKROOT)/System/Library/Frameworks/AudioToolbox.framework',
                        '$(SDKROOT)/System/Library/Frameworks/AudioUnit.framework',
                        '$(SDKROOT)/System/Library/Frameworks/CoreAudio.framework',
                        '$(SDKROOT)/System/Library/Frameworks/CoreVideo.framework',
                        '$(SDKROOT)/System/Library/Frameworks/OpenGL.framework',
                        '$(SDKROOT)/System/Library/Frameworks/QTKit.framework',
                        '$(SDKROOT)/System/Library/Frameworks/AppKit.framework',
                        '$(SDKROOT)/System/Library/Frameworks/Foundation.framework'
                    ],
                },


                'xcode_settings': {
                    'CLANG_CXX_LANGUAGE_STANDARD': 'c++11',
                    'GCC_ENABLE_CPP_RTTI': 'NO',
                    'MACOSX_DEPLOYMENT_TARGET': '10.5',
                    'OTHER_CFLAGS': [
                        '-fno-strict-aliasing'
                    ],
                    'WARNING_CFLAGS': [
                        '-Wall',
                        '-Wendif-labels',
                        '-W',
                        '-Wno-unused-parameter'
                    ],
                },

                'include_dirs': [
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include',
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp',
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include',
                    './vendor/libwebsockets/lib',
                    './vendor/libwebsockets/build',
                    './vendor/jsoncpp/include'
                ]
            }]
        }]
    ]

}
