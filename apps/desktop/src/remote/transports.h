#ifndef TRANSPORTS_H_
#define TRANSPORTS_H_

#include <windows.h>
#include "remote/commanders.h"

namespace Transports
{
  class BaseTransport
  {
  public:
    BaseTransport(Commanders::BaseCommander* commander);
    virtual void open() = 0;
    virtual void onCommanderCommand(Commanders::Command* command) = 0;
  protected:
    Commanders::BaseCommander* _commander;
  };


  class CLITransport : public BaseTransport
  {

  public:
    CLITransport(Commanders::BaseCommander* commander);
    void open();
    void onCommanderCommand(Commanders::Command* command);

  private:
    void handleOutput();
    // void handleInput();
  };
}

#endif