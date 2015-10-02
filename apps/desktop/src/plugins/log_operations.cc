#include "./log_operations.h"
#include "../core/thread/thread.h"
#include <json/json.h>

namespace app {

  LogOperationsBus::LogOperationsBus(mesh::Bus* mainBus):_mainBus(mainBus) {

  }

  mesh::Response* LogOperationsBus::execute(mesh::Request* request) {
    Json::Value root;
    Json::FastWriter writer;
    root["name"] = request->name;
    char* str = (char*)writer.write(root).c_str();

    // remove newline
    str[std::strlen(str) - 1] = 0;

    LOG_VERBOSE("op: " << str);

    return this->_mainBus->execute(request);
  }

};
