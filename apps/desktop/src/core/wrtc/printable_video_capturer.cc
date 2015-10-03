#include "./printable_video_capturer.h"
#include "webrtc/base/bind.h"

namespace wrtc {


class CapturerThread : public rtc::MessageHandler {
public:
    CapturerThread(PrintableVideoCapturer* capturer) : capturer_(capturer) {
        isRunning_ = false;
        thread_ = new rtc::Thread();
        thread_->Start();

        time_stamp_ = 0;
    }

    ~CapturerThread() {
        thread_->Quit();
        delete thread_;
    }

    void Start() {
        thread_->PostDelayed(100, this, MSG_CAPTURE_TIMER);
        isRunning_ = true;
    }

    void Stop() {
        thread_->Clear(this);
        isRunning_ = false;
    }

    bool IsRunning() {
        return isRunning_;
    }

protected:
    enum {
        MSG_CAPTURE_TIMER,
    };

    void OnMessage(rtc::Message* msg) {
        switch(msg->message_id) {
        case MSG_CAPTURE_TIMER:
            thread_->PostDelayed(120, this, MSG_CAPTURE_TIMER);
            capturer_->run();
        }
    }

private:
    rtc::Thread* thread_;
    bool isRunning_;
    PrintableVideoCapturer* capturer_;

    int64 time_stamp_;
};

  PrintableVideoCapturer::PrintableVideoCapturer(graphics::Printable* printable):
  target(printable),
  _isRunning(false),
  _startThread(nullptr) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    _mh = new CapturerThread(this);
  }

  bool PrintableVideoCapturer::GetBestCaptureFormat(const cricket::VideoFormat& desired, cricket::VideoFormat* best_format) {
      *best_format = desired; // TODO
      return true;
  }

  cricket::CaptureState PrintableVideoCapturer::Start(const cricket::VideoFormat& format) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    // frames need to be sent to.

    SetCaptureFormat(&format);

    _startTime = rtc::TimeNanos();
    _isRunning = true;
    SetCaptureState(cricket::CaptureState::CS_RUNNING);

    _startThread = rtc::Thread::Current();
    _mh->Start();

    return cricket::CS_RUNNING;
  }

  void PrintableVideoCapturer::Stop() {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
    _isRunning = false;
    _mh->Stop();
    delete _mh;
    SetCaptureFormat(NULL);
    _startThread = nullptr;
  }

  bool PrintableVideoCapturer::IsRunning() {
    return _isRunning;
  }

  bool PrintableVideoCapturer::IsScreencast() const {
    return true;
  };

  bool PrintableVideoCapturer::GetPreferredFourccs(std::vector<uint32>* fourccs) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  void* PrintableVideoCapturer::run() {

  //   if (_startThread->IsCurrent()) {
  //   SignalFrameCaptured(this, &frame);
  // } else {
  //   _startThread->Invoke<void>(
  //       rtc::Bind(&AVFoundationVideoCapturer::SignalFrameCapturedOnStartThread,
  //                 this, &frame));
  // }
    LOG_VERBOSE(__PRETTY_FUNCTION__);

    cricket::CapturedFrame frame;
    graphics::Bitmap* bm = target->print();

    int64 currentTime = rtc::TimeNanos();
    frame.data         = bm->data;
    frame.width        = bm->bounds.width;
    frame.height       = bm->bounds.height;

    //https://code.google.com/p/libyuv/wiki/Formats
    frame.fourcc       = cricket::FOURCC_ABGR;
    frame.data_size    = bm->size;
    frame.time_stamp   = currentTime;
    frame.elapsed_time = currentTime - _startTime;

    _startThread->Invoke<void>(
        rtc::Bind(&PrintableVideoCapturer::signalFrameCapturedOnStartThread2,
                  this, &frame));

    delete bm;
  }

  void PrintableVideoCapturer::signalFrameCapturedOnStartThread2(const cricket::CapturedFrame* frame) {
    SignalFrameCaptured(this, frame);
  }

}
