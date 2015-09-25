/*
* The MIT License (MIT)
*
* Copyright (c) 2015 vmolsa <ville.molsa@gmail.com> (http://github.com/vmolsa)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
*/

#include "Core.h"

#include "talk/app/webrtc/peerconnectionfactoryproxy.h"
#include "talk/app/webrtc/proxy.h"

#ifdef WIN32
#include "webrtc/base/win32socketinit.h"
#endif

using namespace wrtc;

class ProcessMessages : public rtc::Runnable {
 public:
  virtual void Run(rtc::Thread* thread) {
    
    if (thread) {
      thread->ProcessMessages(rtc::ThreadManager::kForever);
    } else {
      LOG(LS_ERROR) << "Internal Thread Error!";
      abort();
    }
  }
};

class ThreadConstructor : public ProcessMessages {
  public:
    ThreadConstructor() :
      _worker(new rtc::Thread())
    {
      _worker->Start(this);
    }
    
    virtual ~ThreadConstructor() {
      _worker->Stop();
      delete _worker;
    }
    
    rtc::Thread *Current() const {
      return _worker;
    }
     
  protected:
    rtc::Thread* _worker;
};

class PeerConnectionFactory : public ThreadConstructor, public webrtc::PeerConnectionFactory {
  public:
    PeerConnectionFactory() :
      webrtc::PeerConnectionFactory(rtc::Thread::Current(), ThreadConstructor::Current(), NULL, NULL, NULL)
    { }    
};


ThreadConstructor* _signal;
rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;

void Core::Init() {
  LOG(LS_INFO) << __PRETTY_FUNCTION__;
  
  #ifdef WIN32
    rtc::EnsureWinsockInit();

  #endif
    rtc::InitializeSSL();

    _signal = new ThreadConstructor();
    rtc::ThreadManager::Instance()->SetCurrentThread(_signal->Current());
    
    if (rtc::ThreadManager::Instance()->CurrentThread() != _signal->Current()) {
      LOG(LS_ERROR) << "Internal Thread Error!";
      abort();
    }
    
    _factory = Core::CreateFactory();

}

void Core::Dispose() {
  LOG(LS_INFO) << __PRETTY_FUNCTION__;

  _factory.release();

  
  delete _signal;
}

rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> Core::CreateFactory() {

  rtc::scoped_refptr<PeerConnectionFactory> factory(new rtc::RefCountedObject<PeerConnectionFactory>());
  
  webrtc::MethodCall0<PeerConnectionFactory, bool> call(factory.get(), &webrtc::PeerConnectionFactory::Initialize);
  bool result = call.Marshal(factory->signaling_thread());
  
  if (!result) {
    return NULL;
  }
  
  return webrtc::PeerConnectionFactoryProxy::Create(factory->signaling_thread(), factory);
}

webrtc::PeerConnectionFactoryInterface* Core::GetFactory() {
  LOG_VERBOSE(__FUNCTION__);
  Core::Init();
  
  return _factory.get();
}
