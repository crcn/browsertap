#ifndef CORE_THREAD_H_
#define CORE_THREAD_H_

#include "./core.h"
#include "./runnable.h"

namespace core {

  typedef void* (ThreadCallback)(void*);

  class Thread {
  public:

    void* join();
    void detach();
    static Thread* run(void* data, ThreadCallback* callback);
    static Thread* run(ThreadCallback* callback);
    static Thread* run(Runnable* runnable);

    ~Thread();

  private:
    pthread_t _thread;
    Thread(void* data, ThreadCallback* callback);
    static void* _runRunnable(void* runnable);
  };
}

#endif
