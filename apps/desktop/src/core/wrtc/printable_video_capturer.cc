#include "./printable_video_capturer.h"
#include "webrtc/base/bind.h"
// #include <chrono>

namespace wrtc {
  PrintableVideoCapturer::PrintableVideoCapturer(graphics::Printable* printable):
  target(printable),
  _isRunning(false), 
  _startThread(nullptr) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  bool PrintableVideoCapturer::GetBestCaptureFormat(const cricket::VideoFormat& desired, cricket::VideoFormat* best_format) {
      *best_format = desired; // TODO
      return true;
  }

  cricket::CaptureState PrintableVideoCapturer::Start(const cricket::VideoFormat& format) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    // frames need to be sent to.
    _startThread = rtc::Thread::Current();
    SetCaptureFormat(&format);

    _startTime = rtc::TimeNanos();
    this->_isRunning = true;
    SetCaptureState(cricket::CaptureState::CS_RUNNING);


    core::Thread::run(this);

    // this->_startTime = 1000000 * static_cast<int64>(rtc::Time()); // ns to ms
    return cricket::CS_RUNNING;

  }

  void PrintableVideoCapturer::Stop() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    this->_isRunning = false;
    SetCaptureFormat(NULL);
    _startThread = nullptr;
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

  //   if (_startThread->IsCurrent()) {
  //   SignalFrameCaptured(this, &frame);
  // } else {
  //   _startThread->Invoke<void>(
  //       rtc::Bind(&AVFoundationVideoCapturer::SignalFrameCapturedOnStartThread,
  //                 this, &frame));
  // }
    while(1) {
      LOG_VERBOSE(__PRETTY_FUNCTION__); 

      cricket::CapturedFrame frame;
      graphics::Bitmap* bm = this->target->print();

      // frame.time_stamp   = 1000000 * static_cast<int64>(rtc::Time());
      // frame.elapsed_time = 33333333;

      // std::chrono::nanoseconds dur = std::chrono::high_resolution_clock::now().time_since_epoch();
      // frame.time_stamp = dur.count();
      int64 currentTime = rtc::TimeNanos();
      frame.data      = bm->data;
      frame.width     = bm->bounds.width;
      frame.height    = bm->bounds.height;
      frame.fourcc    = cricket::FOURCC_ARGB;
      frame.data_size = bm->size;
      frame.time_stamp = currentTime;
      frame.elapsed_time = currentTime - _startTime;

      std::cout << currentTime - _startTime << std::endl;

      // this->SignalFrameCaptured(this, &frame);
      // this->SignalFrameCaptured(this, &frame);


 
      _startThread->Invoke<void>(
          rtc::Bind(&PrintableVideoCapturer::signalFrameCapturedOnStartThread2,
                    this, &frame));

      delete bm;


      // usleep(1000 * 100);

      // core::Thread::run(this);
      break;
    }
  }

  void PrintableVideoCapturer::signalFrameCapturedOnStartThread2(const cricket::CapturedFrame* frame) {
    this->SignalFrameCaptured(this, frame);
  }

}