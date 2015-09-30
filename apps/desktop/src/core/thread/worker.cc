#include "./worker.h"
#include "./manager.h"
#include <iostream>

namespace core {

  _TaskRunner::_TaskRunner(TaskWorker* worker):_worker(worker) {

  }

  void* _TaskRunner::run() {
    return _worker->_run();
  }

  TaskWorker::TaskWorker(TaskManager* manager):_task(nullptr) {
    _runner  = new _TaskRunner(this);
    _manager = manager;
    _thread  = Thread::run(_runner);
  }

  void TaskWorker::doTask(Task* task) {
    // _mutex.lock();
    _task = task;
    // _mutex.unlock();
    // _hasJobCondition.signal();
  }

  void* TaskWorker::_run() {
    while(1) { 

      if(_task != nullptr) {
        _task->run();
        delete _task;
        _task = nullptr;
      }

      _manager->addWaitingWorker(this);

      if (_task == nullptr) {
        _hasJobCondition.wait(_mutex);
      }
    }
  }

  TaskWorker::~TaskWorker() {
    delete _thread;
    delete _runner;
  }
}