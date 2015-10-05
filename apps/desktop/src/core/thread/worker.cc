#include "./worker.h"
#include "./manager.h"
#include "../shims/shims.h"
#include <iostream>

namespace core {

  TaskWorker::TaskWorker(TaskManager* manager):
  _task(nullptr),
  _thread(nullptr),
  _keepAlive(true) {
    _manager = manager;
    _thread = Thread::run(this, [](void* arg) -> void * {
      ((TaskWorker*)arg)->_runTasks();
      return nullptr;
    });
  }

  bool TaskWorker::die() {
    bool canDie = _keepAlive;
    _keepAlive = false;
    return canDie;
  }

  void* TaskWorker::_runTasks() {

    while(_keepAlive) {

      Task* task = _manager->popTask();

      if (task != nullptr) {
        task->run();
        delete task;
        continue;
      }

      _manager->_workerMutex.lock();
      _manager->addWaitingWorker(this);
      startWorkingCondition.wait(_manager->_workerMutex, 1);
      _manager->_workerMutex.unlock();

      usleep(1000);
    }

    _manager->buryWorker(this);
    return nullptr;
  }

  TaskWorker::~TaskWorker() {
    delete _thread;
  }
}
