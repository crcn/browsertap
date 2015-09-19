{
    'includes': [
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/supplement.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/build/common.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/talk/build/common.gypi',
        './common.gypi',
        './config.gypi'
    ],

    'conditions': [
        ['OS=="mac"', {
            'targets': [{
                'target_name': 'main',
                'type': 'executable',
                'sources': [

                    './src/main.cc',
                    './src/application.cc',
                    './src/osx/window.cc',
                    './src/osx/desktop.cc',

                    './src/remote2/server.cc',
                    './src/remote2/peer.cc',
                    './src/remote2/core.cc',

                    './src/core/events/event_emitter.cc',
                    './src/core/io/console.cc'
                ],

                'link_settings': {
                    'libraries': [
                        '/usr/local/bt/remote-desktop-server/vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds/libWebRTC-9725-mac-x86_64-Release.a',
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
                    'CLANG_CXX_LIBRARY': 'libc++', 
                    'GCC_ENABLE_CPP_RTTI': 'NO',
                    'MACOSX_DEPLOYMENT_TARGET': '10.7',
                    'OTHER_CFLAGS': [
                        '-fno-strict-aliasing'
                    ],
                    'WARNING_CFLAGS': [
                        '-Wall',
                        '-Wendif-labels',
                        '-W',
                        '-Wno-unused-parameter',
                    ],
                },

                'include_dirs': [
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include',
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp',
                    './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include',
                    './vendor/jsoncpp/include'
                ]
            }]
        }]
    ]

}
