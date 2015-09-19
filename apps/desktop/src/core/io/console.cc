#include "./console.h"
#include <iostream>
#include <pthread.h>


io::Console::Console(mesh::Bus* bus):io::Base(bus) {
  pthread_t thread;
  pthread_create (&thread, NULL, &captureStdin, this);
}

void* io::Console::captureStdin (void *ptr)
{
  std::cout << "STDIN" << std::endl;
} /* print_message_function ( void *ptr ) */