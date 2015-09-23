#include "./mutex.h"   
#include <unistd.h>
#include <sched.h>

namespace core {   
  ThreadMutex::ThreadMutex() {
    pthread_mutex_init(&this->_mutex, NULL);
  }                                 
  
  void ThreadMutex::lock() {
    pthread_mutex_lock(&this->_mutex);
  }                                     
  
  void ThreadMutex::unlock() {
    pthread_mutex_unlock(&this->_mutex);
  }                                       
};
