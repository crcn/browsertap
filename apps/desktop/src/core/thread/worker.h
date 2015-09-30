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

  class _TaskRunner : public core::Runnable {
  public:
    _TaskRunner(TaskWorker* _worker);
    void* run();
  private:
    TaskWorker* _worker;
  };

  class TaskWorker {
  friend class _TaskRunner;
  public:
    TaskWorker(TaskManager*);
    void doTask(Task*);
    ~TaskWorker();
  private:
    void* _run();
    Thread* _thread;
    TaskManager* _manager;
    Task* _task;
    _TaskRunner* _runner;
    ThreadMutex _mutex;
    ThreadCondition _hasJobCondition;
  };
}

#endif