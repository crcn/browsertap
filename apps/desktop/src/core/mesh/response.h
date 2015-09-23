#ifndef MESH_RESPONSE_H_
#define MESH_RESPONSE_H_

#include "./bus.h"
#include "./request.h"
#include "../thread/thread.h"
#include "../thread/condition.h"
#include "../thread/mutex.h"
#include <queue>

namespace mesh {
  class Response {
  public:
    virtual void* read();
  };
 
  template<typename Type>
  class FnResponse : public Response {
  public:
    FnResponse(Type (*read)()):_read(read) {

    }
    virtual void* read() {
      return (void *)this->_read();
    }
  private:
    Type (*_read)();
  };


  class NoResponse : public Response {
    virtual void* read() {
      return NULL;
    }
  };

  template<typename Type>
  class BufferedResponse : public Response {
    public:
      BufferedResponse(Type buffer):_buffer(buffer) {

      }
      void* read() {
        void* ret = (void *)this->_buffer;
        this->_buffer = NULL;
        return ret;
      }
    private:
      Type _buffer;
  };


  class AsyncResponse : public Response {
    public:
      AsyncResponse(void (*_run2)(mesh::AsyncResponse*)) {
        this->_run2   = _run2;
        this->ended   = false;
        this->_thread = core::Thread::run((void *)this, &AsyncResponse::_run);
      }
      void* read() {
        this->_mutex.lock();
        while(1) {
          if(!this->_chunks.empty()) {
             void* chunk = this->_chunks.front();
             this->_chunks.pop();
            this->_mutex.unlock();
             return chunk;
          }
          if (this->ended) {
            this->_mutex.unlock();
            return NULL;
          }
          this->_chunkCondition.wait(this->_mutex);
        }
      }
      void write(void* chunk) {
        this->_chunks.push(chunk);
        this->_chunkCondition.signal();
      }

      void end(void* chunk) {
        this->write(chunk);
        this->end();
      }
      void end() {
        // this->_mutex.lock();
        this->ended = true;
        // this->_mutex.unlock();
        this->_chunkCondition.signal();
        this->_endCondition.signal();
      }
    private:
      core::ThreadMutex _mutex;
      core::ThreadCondition _chunkCondition;
      core::ThreadCondition _endCondition;
      core::Thread* _thread;
      void (*_run2)(mesh::AsyncResponse*);
      std::queue<void*> _chunks;
      bool ended;
      static void* _run(void* arg) {
        AsyncResponse* resp = (AsyncResponse*) arg;
        resp->_mutex.lock();
        resp->_run2(resp);
        if (!resp->ended) {
          resp->_endCondition.wait(resp->_mutex);
        }
        resp->_mutex.unlock();
      }
  };
}

#endif