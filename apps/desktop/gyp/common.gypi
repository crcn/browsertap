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
                },

                  'defines': [
                    'UNICODE',
                    'WIN32',
                    'WEBRTC_WIN',
                    'NOMINMAX'
                  ],

                'include_dirs': [
                    './vendor/pthreads-w32-2-9-1-release/Pre-built.2/include'
                ],
                'link_settings': {
                    'libraries': [
                        "./vendor/webrtc/lib/Release_x64/webrtc_full.lib",
                        "advapi32.lib",
                        "dmoguids.lib",
                        "msdmo.lib",
                        "secur32.lib",
                        "winmm.lib",
                        "ws2_32.lib",
                        "wmcodecdspuuid.lib"
                    ]
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
                'MACOSX_DEPLOYMENT_TARGET': '10.6',
                'OTHER_CFLAGS': [
                    '-fno-strict-aliasing',
                    '-DWEBRTC_POSIX'
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
                      '/usr/local/bt/remote-desktop-server/vendor/webrtc/lib/Release/libwebrtc_full.a',
                      '/usr/local/bt/remote-desktop-server/vendor/websockets/lib/libwebsockets.a',
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
