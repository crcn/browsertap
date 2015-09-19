#ifndef TRANSPORTS_H_
#define TRANSPORTS_H_

// #include <windows.h>
#include "./commands.h"

namespace remote
{
  class BaseTransport
  {
  public:
    BaseTransport(remote::Commands* commander);
    virtual void open() = 0;
    virtual void onCommanderCommand(remote::Commands* command) = 0;
  protected:
    remote::Commands* _commands;
  };


  class CLITransport : public BaseTransport
  {

  public:
    CLITransport(remote::Commands* commands);
    void open();
    //void onCommanderCommand(Commanders::Command* command);

  private:
    void handleOutput();
    static void handleInput(int *arg);
  };
}

#endif