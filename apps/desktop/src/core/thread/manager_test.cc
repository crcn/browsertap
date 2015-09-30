#include "gtest/gtest.h"
#include "./manager.h"
#include <iostream>

using namespace core;

void* increment(void* arg) {
  int* i  = (int*)arg;
  int& aa = *i;
  aa++;
  std::cout << "RUN" << std::endl;
}

// Tests factorial of negative numbers.
TEST(TaskManager, CanRunASimpleIncrementTask) {
  TaskManager tm;
  int arg = 1;  
  tm.run(new FnTask(&arg, increment));
  tm.run(new FnTask(&arg, increment));
  tm.run(new FnTask(&arg, increment));
  usleep(1000 * 500);
  std::cout << arg << std::endl;
  // EXPECT_EQ(arg, 1); 
  // tm.completeAll();
  // EXPECT_EQ(arg, 2);  
}
