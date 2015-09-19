#include "./transports.h"
#include <stdio.h>
#include <iostream>
#import <pthread.h>

namespace remote
{
  BaseTransport::BaseTransport(remote::Commands* commander):
  _commander(commander)
  {
    commander->addEventListener(remote::Commands::COMMAND, new Events::ClassCbEventListener<BaseTransport, Commanders::Command>(this, &BaseTransport::onCommanderCommand));
  }

  CLITransport::CLITransport(remote::Commands* commander):
  BaseTransport::BaseTransport(commander)
  {

  }

  void CLITransport::open()
  {
    DWORD handleThreadId;
    /*CreateThread(NULL, 0, CLITransport::handleInput, this, 0, &handleThreadId);*/
    pthread_c

    // create a pthread

    pthread_t *tID;
    tErr = pthread_create(tID, NULL, CLITransport::handleInput, &tArg);
    this->handleOutput();
  }

  static void CLITransport::handleInput(int* arg)
  {
    CLITransport* transport = (CLITransport*)param;
    std::string command;
    // this->_commander->execute("{\"name\":\"startRecordingWindow\", \"data\":{\"id\":5}}");
    // this->_commander->execute("{\"name\":\"startRecordingWindow\", \"data\":{\"id\":4}}");
    while(std::getline(std::cin, command))
    {
      transport->_commander->execute(command);
    }

    return 0;
  }

  void CLITransport::onCommanderCommand(Commanders::Command* command)
  {
    //add a boundary so this shit can be parsed
    std::cout << ">>>>>" << command->value() << std::endl;
  }

  void CLITransport::handleOutput()
  {
    Commanders::BaseCommander* commander = this->_commander;

    //timeouts go on in the commander
    while(1) commander->update();
  }
}