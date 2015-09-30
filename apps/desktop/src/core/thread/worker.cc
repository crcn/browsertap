#include "./worker.h"
#include "./manager.h"
#include <iostream>

namespace core {

  TaskWorker::TaskWorker(TaskManager* manager):
  _task(nullptr),
  _thread(nullptr) {
    _manager = manager;
    _thread = Thread::run(this, [](void* arg) -> void * {
      ((TaskWorker*)arg)->_runTasks();
    });
  }

  void* TaskWorker::_runTasks() {
    while(1) { 

      Task* task = _manager->popTask();

      if (task != nullptr) {
        _manager->_workerMutex.lock();
        task->run();
        delete task;
        _manager->_workerMutex.unlock();
        usleep(100); 
        continue;
      }

      _manager->addWaitingWorker(this); 
      startWorkingCondition.wait(_manager->_workerMutex);

      usleep(1);
    }
  }

  TaskWorker::~TaskWorker() {
    delete _thread;
  }
}