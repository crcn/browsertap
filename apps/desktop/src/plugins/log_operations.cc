#include "./log_operations.h"
#include "../core/thread/thread.h"
#include <json/json.h>

namespace app {

  LogOperations::LogOperations(base::Application* app):app(app) {
    mesh::Request tailRequest("tail");
    this->_tail = this->app->bus->execute(&tailRequest);
    core::Thread::run(this);
  }

  void* LogOperations::run() {

    mesh::Request* tailedRequest;

    while(tailedRequest = (mesh::Request*)this->_tail->read()) {

      Json::Value root;
      Json::FastWriter writer;

      root["name"] = tailedRequest->name;

      char* str = (char*)writer.write(root).c_str();

      // remove newline
      str[std::strlen(str) - 1] = 0;

      LOG_VERBOSE("op: " << str);
    }
  }
};