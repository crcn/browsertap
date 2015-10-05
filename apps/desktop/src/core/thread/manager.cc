#include "./manager.h"
#include "../shims/shims.h"
#include <iostream>

namespace core {

  TaskManager::TaskManager():
  _maxWorkers(100), _minWorkers(2),
  _running(false), _numWorkers(0),
  _runThread(nullptr) {
    _numWorkers = 0;
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

      if (_tasks.empty()) {
        _taskMutex.lock();
        _hasTaskCondition.wait(_taskMutex, 1);
        _taskMutex.unlock();
        continue;
      }

      TaskWorker* worker = nullptr;

      _workerMutex.lock();

      if (!_waitingWorkers.empty()) {

        worker = _waitingWorkers.front();
        _waitingWorkers.pop();

        if(_tasks.empty()) {
          if(worker->die()) {
            _numWorkers--;
          }
          _workerMutex.unlock();
        } else {
          _workerMutex.unlock();
          worker->startWorkingCondition.signal();
        }
      } else if (_numWorkers < _maxWorkers) {
        if (_tasks.empty()) continue;
        _numWorkers++;
        // create a new worker - it'll pull stuff off the stack
        worker = new TaskWorker(this);
        _workerMutex.unlock();
      } else {
        _hasWaitingWorkerCondition.wait(_workerMutex);
        _workerMutex.unlock();
      }

      usleep(1000);
    }
  }

  void TaskManager::addWaitingWorker(TaskWorker* worker) {
    _waitingWorkers.push(worker);
    _hasWaitingWorkerCondition.signal();
  }

  void TaskManager::buryWorker(TaskWorker* worker) {
    delete worker;
  }

  core::Task* TaskManager::popTask() {
    _taskMutex.lock();
    if (_tasks.empty()) {
      _taskMutex.unlock();
      return nullptr;
    }
    core::Task* task = _tasks.front();
    _tasks.pop();
    _taskMutex.unlock();
    return task;
  }
}
