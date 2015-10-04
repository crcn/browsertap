#ifndef CORE_THREAD_CONDITION_H_
#define CORE_THREAD_CONDITION_H_

#include <pthread.h>

#ifndef _MSC_VER
#include <sys/time.h>
#else
#include "./time.h"
#endif

namespace core {
  class ThreadMutex;

  class ThreadCondition {
  public:

    ThreadCondition();
    void wait(ThreadMutex& mutex);
    void wait(ThreadMutex& mutex, int ttl);

    void broadcast();
    void signal();

  private:
    pthread_cond_t _condition;
    struct timespec _ts;
    struct timeval _tp;
  };
};

#endif
