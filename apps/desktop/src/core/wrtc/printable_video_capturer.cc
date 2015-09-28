#include "./printable_video_capturer.h"

namespace wrtc {
  PrintableVideoCapturer::PrintableVideoCapturer(graphics::Printable* printable):
  target(printable),
  _isRunning(false) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);

    // Default supported formats. Use ResetSupportedFormats to over write.
    std::vector<cricket::VideoFormat> formats;
    formats.push_back(cricket::VideoFormat(1280, 720,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_ARGB));
    formats.push_back(cricket::VideoFormat(640, 480,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_ARGB));
    formats.push_back(cricket::VideoFormat(320, 240,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_ARGB));
    formats.push_back(cricket::VideoFormat(160, 120,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_ARGB));
    SetSupportedFormats(formats);
  }

  bool PrintableVideoCapturer::GetBestCaptureFormat(const cricket::VideoFormat& desired, cricket::VideoFormat* best_format) {
      *best_format = desired; // TODO
      return true;
  }

  cricket::CaptureState PrintableVideoCapturer::Start(const cricket::VideoFormat& capture_format) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    core::Thread::run(this);
    this->_isRunning = true;
    return cricket::CS_RUNNING;

  }

  void PrintableVideoCapturer::Stop() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    this->_isRunning = false;
  }

  bool PrintableVideoCapturer::IsRunning() {
    return this->_isRunning;
  }

  bool PrintableVideoCapturer::IsScreencast() const {
    return true;
  };

  bool PrintableVideoCapturer::GetPreferredFourccs(std::vector<uint32>* fourccs) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void PrintableVideoCapturer::run() {
    while(1) {
      LOG_VERBOSE(__PRETTY_FUNCTION__); 

      cricket::CapturedFrame frame;
      graphics::Bitmap* bm = this->target->print();

      frame.elapsed_time = 33333333;

      // std::chrono::nanoseconds dur = std::chrono::high_resolution_clock::now().time_since_epoch();
      // frame.time_stamp = dur.count();
      //prevTimestamp += frame.elapsed_time;  // 30 fps

      int len = sizeof(bm->data);
      frame.data = (void*)bm->data;
      frame.width = bm->bounds.width;
      frame.height = bm->bounds.height;
      frame.fourcc = cricket::FOURCC_ABGR;
      frame.data_size = len;


      if (false && frame.width*frame.height*4 != len) {
          std::cerr << "VideoCapturer: with and height don't match size for ABGR data, skipping frame";
      } else {
          //LOG(LS_INFO) << "CaptureThread: got frame " << (int)frameVal << " glGetError: " << glGetError();
          this->SignalFrameCaptured(this, &frame);
      }

      delete bm;


      usleep(1000 * 100);
    }
  }

  void PrintableVideoCapturer::setImageData(uint8_t *pImageBytes, size_t len, int width, int height) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }
}