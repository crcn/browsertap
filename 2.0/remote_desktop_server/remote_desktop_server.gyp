{
    'includes': [
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
                    './src/osx/window.cc',
                    './src/osx/system.cc'
                ],

                'libraries': [
                    '-L`pwd`/../vendor/webrtc-build-scripts/ios/webrtc/libjingle_peerconnection_builds', '-lWebRTC-9725-mac-x86_64-Debug',
                    '/System/Library/Frameworks/AppKit.framework',
                    '/System/Library/Frameworks/Foundation.framework'
                ],

                'xcode_settings': {
                    'CLANG_CXX_LANGUAGE_STANDARD': 'c++11',
                    'GCC_ENABLE_CPP_RTTI': 'NO',
                    'MACOSX_DEPLOYMENT_TARGET': '10.5',
                    'OTHER_CFLAGS': [
                        '-fno-strict-aliasing',
                    ],
                    'WARNING_CFLAGS': [
                        '-Wall',
                        '-Wendif-labels',
                        '-W',
                        '-Wno-unused-parameter',
                    ],
                },

                'include_dirs': [
                ]
            }]
        }]
    ]

}
