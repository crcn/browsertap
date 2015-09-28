#ifndef WRTC_VIDEO_CAPTURER_H_
#define WRTC_VIDEO_CAPTURER_H_

#include "../log/logger.h"
#include "../graphics/printable.h"
#include "talk/media/base/videocapturer.h"
#include "../thread/runnable.h"
#include "../thread/thread.h"

namespace wrtc {
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
    void run();

    void setImageData(uint8_t *pImageBytes, size_t len, int width, int height);

  private:
    bool _isRunning;
    int64 _startTime;
  };
}

#endif