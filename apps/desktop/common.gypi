{
    "conditions": [
        ["OS=='win'", {
            "target_defaults": {
                "default_configuration": "Release_x64",
                "configurations": {
                    "Debug_Win32": {
                        "msvs_configuration_platform": "Win32",
                    },
                    "Debug_x64": {
                        "msvs_configuration_platform": "x64",
                    },
                    "Release_Win32": {
                        "msvs_configuration_platform": "Win32",
                    },
                    "Release_x64": {
                        "msvs_configuration_platform": "x64",
                    }
                }
            }
        }, {
            "target_defaults": {
                "default_configuration": "Release",

                "configurations": {
                    "Debug": {
                        "defines": [
                            "DEBUG"
                        ],
                        "xcode_settings": {
                            "GCC_OPTIMIZATION_LEVEL": "0",
                            "GCC_GENERATE_DEBUGGING_SYMBOLS": "YES"
                        }
                    },
                    "Release": {
                        "defines": [
                            "NDEBUG"
                        ],
                        "xcode_settings": {
                            "GCC_OPTIMIZATION_LEVEL": "3",
                            "GCC_GENERATE_DEBUGGING_SYMBOLS": "NO",
                            "DEAD_CODE_STRIPPING": "YES",
                            "GCC_INLINES_ARE_PRIVATE_EXTERN": "YES"
                        }
                    }
                }
            }
        }],

        ['OS=="mac"', {
            "xcode_settings": {
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
                ]
            },

            'target_defaults': {
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
                  ]
              }
            }
        }]
    ]
}