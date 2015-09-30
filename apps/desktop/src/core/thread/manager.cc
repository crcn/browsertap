#include "./manager.h"
#include <iostream>

namespace core {

  TaskManager::TaskManager():
  _maxWorkers(10), _minWorkers(2), 
  _running(false), _numWorkers(0), 
  _runThread(nullptr) {
    _runThread = Thread::run(this, [](void* arg) -> void * {
      ((TaskManager*)arg)->_runTasks();
    });
  }

  void TaskManager::run(core::Task* task) {
    _taskMutex.lock();
    _tasks.push(task);
    _taskMutex.unlock();
    _hasTaskCondition.signal();
  }

  void TaskManager::_runTasks() {

    while(1) {

      _taskMutex.lock();

      std::cout << _tasks.size() << std::endl;

      if (_tasks.size() == 0) {
        _hasTaskCondition.wait(_taskMutex);
        _taskMutex.unlock();
        continue;
      }

      TaskWorker* worker = nullptr;

      _workerMutex.lock();
   
      if (!_waitingWorkers.empty()) {

        std::cout << "NOT EMPT" << std::endl;

        worker = _waitingWorkers.front();

        _waitingWorkers.pop();

        worker->startWorkingCondition.signal();

      // // otherwise create a new worker if the num workers does not exc
      } else if (_numWorkers < _maxWorkers) {

        std::cout << "create worker" << std::endl;
        _numWorkers++; 
        worker = new TaskWorker(this);
      } else {
        std::cout << "WAIT" << std::endl;
        _taskMutex.unlock(); 
        _workerMutex.unlock();
        _hasWaitingWorkerCondition.wait(_workerMutex);
        continue;
      } 

      _taskMutex.unlock();
      _workerMutex.unlock();

      usleep(100);
    }
  }

  void TaskManager::addWaitingWorker(TaskWorker* worker) {
    _workerMutex.lock();
    _numWorkers--;
    _waitingWorkers.push(worker);
    _workerMutex.unlock(); 
    _hasWaitingWorkerCondition.signal();
  }

  core::Task* TaskManager::popTask() {
    _workerMutex.lock();
    core::Task* task = _tasks.front();
    _tasks.pop();
    _workerMutex.unlock();
    return task;
  }
}