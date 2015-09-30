#ifndef WRTC_VIDEO_CAPTURER_H_
#define WRTC_VIDEO_CAPTURER_H_

#include "../log/logger.h"
#include "../graphics/printable.h"
#include "talk/media/base/videocapturer.h"
#include "../thread/runnable.h"
#include "../thread/thread.h"
#include "webrtc/base/sigslot.h"
#include "./core.h"

namespace wrtc {

  class CapturerThread;

  class PrintableVideoCapturer : public cricket::VideoCapturer, public core::Runnable  {
  public:
    graphics::Printable* target;
    PrintableVideoCapturer(graphics::Printable* target);

    bool GetBestCaptureFormat(const cricket::VideoFormat& desired, cricket::VideoFormat* best_format);
    cricket::CaptureState Start(const cricket::VideoFormat& capture_format);
    void Stop();
    bool IsRunning();
    bool IsScreencast() const;
    bool GetPreferredFourccs(std::vector<uint32>* fourccs);
    void* run();

    // // Callback attached to SignalFrameCaptured where SignalVideoFrames is called.
    // void SignalFrameCaptured(VideoCapturer* video_capturer,
    //                      const CapturedFrame* captured_frame) {
      
    // }


  private:
    bool _isRunning;
    int64 _startTime;
    rtc::Thread* _startThread;  // Set in Start(), unset in Stop().
    CapturerThread* _mh;  // Set in Start(), unset in Stop().
    void signalFrameCapturedOnStartThread2(const cricket::CapturedFrame* frame);
  };


class PrintableVideoRenderer : public webrtc::VideoRendererInterface {
public:
  PrintableVideoRenderer() {

  }
  virtual void SetSize(int width, int height) {
    std::cout << "SET SIZE" << std::endl;
  }
  virtual void RenderFrame(const cricket::VideoFrame* frame) {
    std::cout << "RENDER IT!" << std::endl;
  }
};

}

#endif