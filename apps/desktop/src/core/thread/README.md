https://github.com/tghosgor/threadpool11/blob/2.0/threadpool11/src/pool.cpp
https://github.com/cameron314/concurrentqueue

some psuedocode

```cxx
// run runnable on THIS thread
Thread::run(core::Runnable);

// preferred - runs runnable against any thread that is open. Possibly
// even having lock-free code
core::ThreadManager::run(core::Runnable);
```