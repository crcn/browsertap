{
  'includes': [
    './common.gypi',
    './config.gypi',
    './files.gypi'
  ],
  'target_defaults': {
      'include_dirs': [
          './vendor',
          './vendor/gtest/include',
          './vendor/gtest',
          './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/jsoncpp/source/include',
          './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libsrtp/srtp',
          './vendor/webrtc-build-scripts/ios/webrtc/src/third_party/libyuv/include',
          './vendor/libwebsockets/lib',
          './vendor/libwebsockets/build',
          './vendor/jsoncpp/include'
      ],
      'sources': [

        '<(DEPTH)/vendor/gtest/include/gtest/gtest-death-test.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-message.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-param-test.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-printers.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-spi.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-test-part.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest-typed-test.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest_pred_impl.h',
        '<(DEPTH)/vendor/gtest/include/gtest/gtest_prod.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-death-test-internal.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-filepath.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-internal.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-linked_ptr.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-param-util-generated.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-param-util.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-port.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-string.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-tuple.h',
        '<(DEPTH)/vendor/gtest/include/gtest/internal/gtest-type-util.h',
        '<(DEPTH)/vendor/gtest/src/gtest-death-test.cc',
        '<(DEPTH)/vendor/gtest/src/gtest-filepath.cc',
        '<(DEPTH)/vendor/gtest/src/gtest-internal-inl.h',
        '<(DEPTH)/vendor/gtest/src/gtest-port.cc',
        '<(DEPTH)/vendor/gtest/src/gtest-printers.cc',
        '<(DEPTH)/vendor/gtest/src/gtest-test-part.cc',
        '<(DEPTH)/vendor/gtest/src/gtest-typed-test.cc',
        '<(DEPTH)/vendor/gtest/src/gtest.cc',
        './vendor/gtest/src/gtest_main.cc'
      ]
    },

  'conditions': [
        ['OS=="mac"', {
            'targets': [
                {
                    'target_name': 'app_test',
                    'type': 'executable',
                    'sources': [
                      './src/core/thread/manager_test.cc',
                      './src/commands/sync_windows_task_test.cc'
                    ]
                }
            ]
        }]
    ]
}
