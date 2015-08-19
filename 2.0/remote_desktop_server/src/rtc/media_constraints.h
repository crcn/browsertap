#ifndef _RTC_MEDIA_CONSTRAINS_
#define _RTC_MEDIA_CONSTRAINS_

#include "talk/app/webrtc/mediaconstraintsinterface.h"

// https://github.com/vmolsa/webrtc-native/blob/master/src/MediaConstraints.h
namespace rtc {
  class MediaConstraints : public webrtc::MediaConstraintsInterface, public rtc::RefCountInterface {
    friend class rtc::RefCountedObject<MediaConstraints>;

  };
};
#endif