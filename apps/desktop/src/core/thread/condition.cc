#include <windows.h>
#include "../shims/shims.h"
#include "./condition.h"
#include "./mutex.h"

#ifdef _MSC_VER
struct timespec {
        time_t tv_sec;
        long tv_nsec;
};
#endif

namespace core {
  ThreadCondition::ThreadCondition() {
    pthread_cond_init(&_condition, NULL);
  }

  void ThreadCondition::wait(ThreadMutex& mutex) {
    pthread_cond_wait(&_condition, &mutex._mutex);
  }

  void ThreadCondition::wait(ThreadMutex& mutex, int ttl) {

    struct timespec ts;
    struct timeval tp;

    gettimeofday(&tp, NULL);

     ts.tv_sec  = tp.tv_sec;
     ts.tv_nsec = tp.tv_usec * 1000;
     ts.tv_sec += ttl;

    if(pthread_cond_timedwait(&_condition, &mutex._mutex, &ts)) {
    }
  }

  void ThreadCondition::signal() {
    pthread_cond_signal(&_condition);
  }

  void ThreadCondition::broadcast() {
    pthread_cond_broadcast(&_condition);
  }
}
