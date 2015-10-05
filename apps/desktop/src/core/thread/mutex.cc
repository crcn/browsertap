#include "./mutex.h"   

namespace core {
  ThreadMutex::ThreadMutex() {
    pthread_mutex_init(&_mutex, NULL);
  }

  void ThreadMutex::lock() {
    pthread_mutex_lock(&_mutex);
  }

  void ThreadMutex::unlock() {
    pthread_mutex_unlock(&_mutex);
  }
};
