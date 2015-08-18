{
    'make_global_settings': [
        ['CXX', '/usr/bin/clang++'],
        ['LINK', '/usr/bin/clang++'],
    ],
    "includes": [
        './vendor/webrtc/src/webrtc/supplement.gypi',
        './vendor/webrtc/src/webrtc/build/common.gypi',
        './vendor/webrtc/src/talk/build/common.gypi',
        "./common.gypi",
        "./vars.gypi",
        "./config.gypi"
    ],

    "conditions": [
        ['OS=="mac"', {
            "targets": [{
                "target_name": "main",
                "type": "executable",
                "sources": [
                    "./src/main.cc",
                    "./src/osx/window.cc",
                    "./src/osx/system.cc"
                ],

                "link_settings": {
                    "libraries": [
                        "/System/Library/Frameworks/AppKit.framework",
                        "/System/Library/Frameworks/Foundation.framework"
                    ]
                },

                "libraries": [

                ],


                'xcode_settings': {
                    'CLANG_CXX_LANGUAGE_STANDARD': 'c++11',
                    'CLANG_WARN_OBJC_MISSING_PROPERTY_SYNTHESIS': 'YES',
                    'GCC_VERSION': 'com.apple.compilers.llvm.clang.1_0',
                    'ALWAYS_SEARCH_USER_PATHS': 'NO',
                    'GCC_CW_ASM_SYNTAX': 'NO',
                    'GCC_DYNAMIC_NO_PIC': 'NO',

                    'GCC_ENABLE_CPP_EXCEPTIONS': 'NO',
                    'GCC_ENABLE_CPP_RTTI': 'NO',
                    'GCC_ENABLE_PASCAL_STRINGS': 'NO',
                    'GCC_THREADSAFE_STATICS': 'NO',
                    'PREBINDING': 'NO',
                    'MACOSX_DEPLOYMENT_TARGET': '10.5',
                    'USE_HEADERMAP': 'NO',
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


                'conditions': [
                    ['target_arch=="ia32"', {
                        'xcode_settings': {
                            'ARCHS': ['i386']
                        },
                    }],
                    ['target_arch=="x64"', {
                        'xcode_settings': {
                            'ARCHS': ['x86_64']
                        },
                    }],
                ],

                'dependencies': [],

                'include_dirs': [
                    '<(DEPTH)/vendor/webrtc/src/third_party/jsoncpp/source/include',
                    '<(DEPTH)/vendor/webrtc/src/third_party/libsrtp/srtp',
                    '<(DEPTH)/vendor/webrtc/src/third_party/libyuv/include',
                    '<(DEPTH)/vendor/webrtc/src'
                ]

            }]
        }]
    ]

}
