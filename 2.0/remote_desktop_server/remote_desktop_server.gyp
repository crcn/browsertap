{
    "includes": [
        "common.gypi"
    ],
    "conditions": [
        ['OS=="mac"', {
            "targets": [
                {
                    "target_name": "main",
                    "type": "executable",
                    "sources": [
                        "./src/main.cc",
                        "./src/osx/system.cc",
                        "./src/osx/window.cc"
                    ],

                    "link_settings": {
                        "libraries": [
                            "/System/Library/Frameworks/AppKit.framework",
                            "/System/Library/Frameworks/Foundation.framework"
                        ]
                    }
                }
            ]
        }]
    ]

}
