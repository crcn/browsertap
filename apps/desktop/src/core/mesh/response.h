#ifndef MESH_RESPONSE_H_
#define MESH_RESPONSE_H_

#include "./bus.h"
#include "./request.h"
#include "../thread/thread.h"
#include "../thread/condition.h"
#include "../thread/mutex.h"
#include "../thread/runnable.h"
#include <queue>

namespace mesh {
  class Response {
  public:
    virtual void* read();
    virtual ~Response() { };
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

      AsyncResponse(core::Runnable* _runnable = NULL) {

        this->_runnable = _runnable;
        this->_thread   = NULL;
        this->ended     = false;

        if (_runnable != NULL) {
          this->_thread   = core::Thread::run((void *)this, &AsyncResponse::_run);
        }
      }

      void* read() {
        this->_mutex.lock();

        // continue until there is data, or the response
        // has ended.
        while(1) {

          // got chunks? Pop one off
          if(!this->_chunks.empty()) {
             void* chunk = this->_chunks.front();
             this->_chunks.pop();
            this->_mutex.unlock();
             return chunk;
          }

          if (this->ended) {
            this->_mutex.unlock();

            // ended - return NULL - no data.
            return NULL;
          }

          // no chunks & no end. Async stuff going on, so wait!
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
        this->ended = true;
        this->_chunkCondition.signal();
        this->_endCondition.signal();
      }

      virtual ~AsyncResponse() {
        if (this->_thread != NULL) {
          delete this->_thread;
        }
      }

    private:
      void* _arg;
      core::ThreadMutex _mutex;
      core::ThreadCondition _chunkCondition;
      core::ThreadCondition _endCondition;
      core::Thread* _thread;
      core::Runnable* _runnable;
      std::queue<void*> _chunks;
      bool ended;
      static void* _run(void* arg) {
        AsyncResponse* _this = (AsyncResponse*) arg;
        _this->_mutex.lock();
        _this->_runnable->run();
        if (!_this->ended) {
          _this->_endCondition.wait(_this->_mutex);
        }
        _this->_mutex.unlock();
      }
  };
}

#endif
