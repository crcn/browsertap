{
    'includes': [
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/supplement.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/webrtc/build/common.gypi',
        './vendor/webrtc-build-scripts/ios/webrtc/src/talk/build/common.gypi',
        './common.gypi',
        './config.gypi',
        './files.gypi'
    ],

    'conditions': [
        ['OS=="mac"', {
            'targets': [
                {
                    'target_name': 'app',
                    'type': 'executable',
                    'sources': [
                        './src/main.cc'
                    ]
                }
            ] 
        }]
    ]

}