#ifndef LOG_LOGGER_H_
#define LOG_LOGGER_H_

#include <iostream>

#define LOG_VERBOSE(MESSAGE) \
  (\
    (std::cout << "\033[90m:\033[39m " << MESSAGE << std::endl) \
  )

#define LOG_NOTICE(MESSAGE) \
  (\
    (std::cout << "\033[34m:\033[39m " << MESSAGE << std::endl) \
  )

#define LOG_INFO(MESSAGE) \
  (\
    (std::cout << "\033[36m:\033[39m " << MESSAGE << std::endl) \
  )

#define LOG_WARN(MESSAGE) \
  (\
    (std::cout << "\033[33m:\033[39m " << MESSAGE << std::endl) \
  )

#define LOG_ERROR(MESSAGE) \
  (\
    (std::cout << "\033[31m:\033[39m " << MESSAGE << std::endl) \
  )

#endif