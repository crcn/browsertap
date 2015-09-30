#include "./manager.h"
#include <iostream>

namespace core {

  TaskManager::TaskManager():_maxWorkers(100), _minWorkers(2), _running(false), _numWorkers(0) {

  }

  void TaskManager::run(core::Task* task) {

    // _mutex.lock();
    _tasks.push(task);
    // _mutex.unlock();

    _runTasks();
  }

  void TaskManager::_runTasks() {
    if (_running) return;

    _running = true;

    while(_tasks.size() > 0) {

      // _mutex.lock();

      std::cout << "TS" << _tasks.size() << std::endl;

      TaskWorker* worker = nullptr;

      // already workers waiting? Pop it off!
      if (_waitingWorkers.size() > 0) {
        worker = _waitingWorkers.front();
        _waitingWorkers.pop();

      // otherwise create a new worker if the num workers does not exc
      } else if (_numWorkers <= _maxWorkers) {
        worker = new TaskWorker(this);
      } else {
        _hasWaitingWorkerCondition.wait(_mutex);
        continue;
      }

      worker->doTask(_tasks.front());
      _tasks.pop();

      // _mutex.unlock();

      // ease up on the CPU - this is a 1ms timeout
      // usleep(1000);
    }
  }

  void TaskManager::addWaitingWorker(TaskWorker* worker) {
    // _mutex.lock();
    _waitingWorkers.push(worker);
    // _mutex.unlock();
    // _hasWaitingWorkerCondition.signal();
  }
}