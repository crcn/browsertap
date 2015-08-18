#ifndef _RTC_ICE_SERVER_
#define _RTC_ICE_SERVER_

#include <vector>

namespace rtc {
  class ICEServer {

  public:
    std::vector<const char*> urls;
    const char* username;
    const char* credential;

    ICEServer(std::vector<const char*> urls, const char* username = NULL, const char* credential = NULL):
    urls(urls),
    username(username),
    credential(credential) {
      
    }

    ICEServer(const char* url, const char* username = NULL, const char* credential = NULL):
    username(username),
    credential(credential) {
      urls.push_back(url);
    }
  };
};

#endif