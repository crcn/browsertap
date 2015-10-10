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
    virtual void* read()=0;
    virtual ~Response() { };
  };

  template<typename Type>
  class FnResponse : public Response {
  public:
    FnResponse(Type (*read)()):_read(read) {

    }
    virtual void* read() {
      return (void *)_read();
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
        void* ret = (void *)_buffer;
        _buffer = NULL;
        return ret;
      }
    private:
      Type _buffer;
  };

  class AsyncResponse : public Response, public core::Runnable {
    public:

      AsyncResponse(core::Runnable* runnable = nullptr):
      _runnable(runnable),
      _thread(nullptr),
      ended(false) {
        if (_runnable != nullptr) {
          _thread   = core::Thread::run(this);
        }
      }

      void* read() {
        _mutex.lock();

        // continue until there is data, or the response
        // has ended.
        while(1) {

          // got chunks? Pop one off
          if(!_chunks.empty()) {
             void* chunk = _chunks.front();
             _chunks.pop();
             _mutex.unlock();
             return chunk;
          }

          if (ended) {
            _mutex.unlock();

            // ended - return NULL - no data.
            return NULL;
          }

          // no chunks & no end. Async stuff going on, so wait!
          _chunkCondition.wait(_mutex);
        }
      }

      void write(void* chunk) {
        _chunks.push(chunk);
        _chunkCondition.signal();
      }

      void end(void* chunk) {
        write(chunk);
        end();
      }

      void end() {
        ended = true;
        _chunkCondition.signal();
        _endCondition.signal();
      }

      virtual ~AsyncResponse() {
        if (_thread != NULL) {
          delete _thread;
        }
      }

      void* run() {
        _mutex.lock();
        _runnable->run();
        if (!ended) {
          _endCondition.wait(_mutex);
        }
        _mutex.unlock();
        return nullptr;
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
  };
}

#endif
