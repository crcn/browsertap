{
    'includes': [
        './files.gypi'
    ],

    'targets': [
        {
            'target_name': 'app',
            'type': 'executable',
            'sources': [
                '<(DEPTH)/src/main.cc'
            ]
        }
    ]
}
