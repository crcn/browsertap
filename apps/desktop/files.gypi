{
    'includes': [
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/supplement.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/build/common.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/talk/build/common.gypi',
        './common.gypi',
        './config.gypi'
    ],

    'target_defaults': {
        'include_dirs': [
            './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include',
            './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp',
            './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include',
            './vendor/libwebsockets/lib',
            './vendor/libwebsockets/build',
            './vendor/jsoncpp/include'
        ],
        'sources': [
            './src/application.cc',
            './src/commands/commands.cc',
            './src/active_records/wrtc_connection.cc',
            './src/active_records/virt_window.cc',

            './src/plugins/log_operations.cc',

            './src/core/wrtc/connection.cc',
            './src/core/wrtc/observers.cc',
            './src/core/wrtc/core.cc',
            './src/core/wrtc/printable_video_capturer.cc',

            './src/core/thread/condition.cc',
            './src/core/thread/mutex.cc',
            './src/core/thread/thread.cc',
            './src/core/thread/manager.cc',
            './src/core/thread/worker.cc',

            './src/core/active_record/object.cc',
            './src/core/active_record/collection.cc',
            './src/core/active_record/db.cc',

            './src/core/events/event_emitter.cc',
            './src/core/io/console.cc',
            './src/core/io/websockets.cc'
        ],

        "conditions": [
            ["OS=='mac'", {
                'sources': [
                    './src/core/virt/osx/window.cc',
                    './src/core/virt/osx/desktop.cc'
                ]
            }],
            ["OS=='win'", {

                'sources': [
                    './src/core/virt/win32/window.cc',
                    './src/core/virt/win32/desktop.cc'
                ]
            }]
        ]
    }
}
