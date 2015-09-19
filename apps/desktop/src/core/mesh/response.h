#ifndef MESH_RESPONSE_H_
#define MESH_RESPONSE_H_

#include "./bus.h"
#include "./request.h"
#include <functional>

namespace mesh {
  class Response {
  public:
    virtual void* read();
  };
 
  template<typename Type>
  class FnResponse : public Response {
  public:
    FnResponse(std::function<Type()> read):_read(read) {

    }
    virtual void* read() {
      return (void *)this->_read();
    }
  private:
    std::function<Type()> _read;
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
}

#endif