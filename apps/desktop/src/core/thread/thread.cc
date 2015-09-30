#include "./thread.h"
#include <unistd.h>
#include <sched.h>


namespace core {

  Thread::Thread(void* data, ThreadCallback* callback) {
    pthread_create(&this->_thread, NULL, callback, data);
  }

  Thread* Thread::run(void* data, ThreadCallback* callback) {
    return new Thread(data, callback);
  }

  Thread* Thread::run(ThreadCallback* callback) {
    return Thread::run(NULL, callback);
  } 

  Thread* Thread::run(Runnable* runnable) {
    return Thread::run(runnable, &Thread::_runRunnable);
  } 
  
  void* Thread::join() {
    void* result = NULL;
    pthread_join(this->_thread, &result);  
    return result;
  }                                         
  
  void Thread::detach() {
    pthread_detach(this->_thread);
  }    

  void* Thread::_runRunnable(void* runnable) {
    Runnable* r = (Runnable*)runnable;
    return r->run();
  }
  
  Thread::~Thread() {
    this->detach();
  }   
};