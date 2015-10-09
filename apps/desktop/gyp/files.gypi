{
    'includes': [
        './common.gypi',
        './config.gypi'
    ],

    'target_defaults': {
        'include_dirs': [
            '<(DEPTH)/vendor/webrtc/include',
            '<(DEPTH)/vendor/websockets/include',
            '<(DEPTH)/vendor/jsoncpp/include'
        ],
        'sources': [
            '<(DEPTH)/src/application.cc',
            '<(DEPTH)/src/commands/commands.cc',
            '<(DEPTH)/src/active_records/wrtc_connection.cc',
            '<(DEPTH)/src/active_records/virt_window.cc',

            '<(DEPTH)/src/plugins/log_operations.cc',

            '<(DEPTH)/src/core/wrtc/connection.cc',
            '<(DEPTH)/src/core/wrtc/observers.cc',
            '<(DEPTH)/src/core/wrtc/core.cc',
            '<(DEPTH)/src/core/wrtc/printable_video_capturer.cc',

            '<(DEPTH)/src/core/thread/condition.cc',
            '<(DEPTH)/src/core/thread/mutex.cc',
            '<(DEPTH)/src/core/thread/thread.cc',
            '<(DEPTH)/src/core/thread/manager.cc',
            '<(DEPTH)/src/core/thread/worker.cc',

            '<(DEPTH)/src/core/active_record/object.cc',
            '<(DEPTH)/src/core/active_record/collection.cc',
            '<(DEPTH)/src/core/active_record/db.cc',

            '<(DEPTH)/src/core/events/event_emitter.cc',
            '<(DEPTH)/src/core/io/console.cc',
            '<(DEPTH)/src/core/io/websockets.cc'
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
