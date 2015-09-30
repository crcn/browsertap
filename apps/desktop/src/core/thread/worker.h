#ifndef CORE_THREAD_WORKER_H_
#define CORE_THREAD_WORKER_H_

#include "./task.h"
#include "./condition.h"
#include "./mutex.h"
#include "./runnable.h"
#include "./thread.h"

namespace core {
  class TaskManager;
  class TaskWorker;

  class TaskWorker {
  friend class _TaskRunner;
  public:
    TaskWorker(TaskManager*);
    ThreadCondition startWorkingCondition;
    ~TaskWorker();
  private:
    void* _runTasks();
    Thread* _thread;
    TaskManager* _manager;
    Task* _task;
    ThreadMutex _mutex;
  };
}

#endif