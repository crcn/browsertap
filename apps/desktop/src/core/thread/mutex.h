#ifndef CORE_THREAD_MUTEX_H_
#define CORE_THREAD_MUTEX_H_

#include "./core.h"

namespace core {

  class ThreadCondition;

  class ThreadMutex {
  public:

    /**
     */

    ThreadMutex();

    /**
     */

    void lock();

    /**
     */

    void unlock();

    friend class ThreadCondition;

  private:
    pthread_mutex_t _mutex;
  };
};

#endif
