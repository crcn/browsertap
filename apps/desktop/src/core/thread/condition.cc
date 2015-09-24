#include "./condition.h"
#include "./mutex.h"

namespace core {
  ThreadCondition::ThreadCondition() {                                      
    pthread_cond_init(&this->_condition, NULL);
  }                                             
  
  void ThreadCondition::wait(ThreadMutex& mutex) {                                
    pthread_cond_wait(&this->_condition, &mutex._mutex);     
  }                                             
  
  // void ThreadCondition::wait(ThreadMutex& mutex, int ttl) {            
  //   gettimeofday(&_tp, NULL);                          
    
  //   _ts.tv_sec  = _tp.tv_sec;
  //   _ts.tv_nsec = _tp.tv_usec * 1000;
  //     _ts.tv_sec += ttl;           
    
  //   if(pthread_cond_timedwait(&this->_condition, &mutex._mutex, &_ts)) {
  //     //std::cout << "ER" << std::endl;
  //   }
  // }    
  
  void ThreadCondition::signal() {
    pthread_cond_signal(&this->_condition);
  }          
  
  void ThreadCondition::broadcast() {
    pthread_cond_broadcast(&this->_condition);
  }
}