#ifndef CORE_THREAD_CONDITION_H_
#define CORE_THREAD_CONDITION_H_

#include "./core.h"

#ifndef _MSC_VER
#include <sys/time.h>
#else
// #include "./time.h"
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
  };
};

#endif
