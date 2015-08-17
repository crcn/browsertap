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
                        "./src/osx/window.cc",
                        "./src/osx/system.cc"
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
