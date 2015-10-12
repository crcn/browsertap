#ifndef _AR_OBJECT_ID_
#define _AR_OBJECT_ID_
#include <sstream>
#include <iostream>
#include <stdlib.h>
#include <time.h>
#include <windows.h>
namespace activeRecord {
  int _idCount = 0;
  long machine = 0;
  long getMachineId() {
    if (machine != 0) return machine;
    srand(time(NULL));
    machine = rand();
  }

  std::string hex(int size, int value) {
    std::stringstream ss;
    ss << std::hex << value;
    std::string vv = ss.str();
    if (vv.size() == size) {
      return vv;
    }
    std::string padding = "00000000";
    ss.str(""); // empty
    ss << padding.substr(0, size - vv.size())  << vv;

    return ss.str();
  }

  std::string generateUniqueId() {
    std::stringstream ss;
    ss << hex(8, time(nullptr));
    ss << hex(6, getMachineId());
    ss << hex(4, GetCurrentProcessId());
    ss << hex(6, _idCount++);
    return ss.str();
  }
};
#endif
