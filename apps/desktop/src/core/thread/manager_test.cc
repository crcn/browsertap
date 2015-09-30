#include "gtest/gtest.h"
#include "./manager.h"
#include <iostream>

using namespace core;

void* increment(void* arg) {
  int* i  = (int*)arg;
  int& aa = *i;
  aa++;
}

// Tests factorial of negative numbers.
// TEST(TaskManager, CanRunASimpleIncrementTask) {
//   TaskManager tm;
//   int arg = 1;  
//   tm.run(new FnTask(&arg, increment));
//   EXPECT_EQ(arg, 1); 
//   tm.run(new FnTask(&arg, increment));
//   EXPECT_EQ(arg, 1); 
//   tm.run(new FnTask(&arg, increment));
//   usleep(1000*10);
//   EXPECT_EQ(arg, 4); 
// }
 
// Tests factorial of negative numbers.
TEST(TaskManager, CanRunManyTasks) {
  TaskManager tm;
  int arg = 0;  
  for (int i = 1000; i--;) {
    tm.run(new FnTask(&arg, increment));
  }
  usleep(1000*500);
  std::cout << arg << "a" << std::endl;
  // EXPECT_EQ(arg, 100); 
}
