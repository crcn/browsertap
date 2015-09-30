#ifndef CORE_THREAD_MANAGER_H_
#define CORE_THREAD_MANAGER_H_

#include "./task.h"
#include "./condition.h"
#include "./mutex.h"
#include "./worker.h"
#include <queue>
#include <map>

namespace core {
  class TaskManager {
  public:

    /**
     */

    TaskManager();

    /**
     * runs a task
     */

    void run(core::Task*);

    /**
     */

    void addWaitingWorker(TaskWorker*);

    /**
     */

    core::Task* popTask();
    ThreadMutex _workerMutex;
    ThreadMutex _taskMutex;

  private:

    Thread* _runThread;
    ThreadCondition _hasWaitingWorkerCondition;
    ThreadCondition _hasTaskCondition;
    std::queue<Task*> _tasks;
    std::queue<TaskWorker*> _waitingWorkers;
    std::vector<TaskWorker*> _runningWorkers;
    void _runTasks();
    int _maxWorkers;
    int _numWorkers;
    int _minWorkers;
    bool _running;
  };
} 

#endif   