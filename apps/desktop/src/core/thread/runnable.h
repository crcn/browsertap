#ifndef CORE_THREAD_RUNNABLE_H_
#define CORE_THREAD_RUNNABLE_H_

namespace core {
  class Runnable {
  public:
    virtual void run()=0;
  };
}

#endif