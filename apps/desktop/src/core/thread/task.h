#ifndef CORE_THREAD_TASK_H_
#define CORE_THREAD_TASK_H_

#include "./runnable.h"

namespace core {
  class Task : public core::Runnable {
  public:
    Task() { }
    virtual void* run()=0;
    virtual ~Task() { }
  };

  class FnTask : public Task {
  public:
    FnTask(void* arg, void* (*run)(void* arg)):_run(run) {
      _arg = arg;
    }
    void* run() {
      return _run(_arg);
    }
    ~FnTask() {

    }
  private:
    void* _arg;
    void* (*_run)(void* arg);
  };
}

#endif
