#ifndef CORE_THREAD_CONDITION_H_
#define CORE_THREAD_CONDITION_H_    

#include <pthread.h>    
#include <sys/time.h>  

namespace core { 
  class ThreadMutex;    
  
  class ThreadCondition {
  public:        
    
    ThreadCondition();
    
    /**
     * wait until a condition has been broadcasted
     */                                           
    
    void wait(ThreadMutex& mutex);
    
    /**
     * broadcasts to all waiting threads
     */
    
    void broadcast();
    
    
    /**
     * signals to one pthread
     */
    
    void signal();                     
    
  private:
    pthread_cond_t _condition; 
    struct timespec _ts;
    struct timeval _tp;      
  };                     
};

#endif