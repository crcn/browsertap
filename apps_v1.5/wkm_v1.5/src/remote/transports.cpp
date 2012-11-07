#include "remote/transports.h"
#include <stdio.h>
#include <iostream>

namespace Transports
{
	BaseTransport::BaseTransport(Commanders::BaseCommander* commander):
	_commander(commander)
	{
		commander->addEventListener(Commanders::Command::COMMAND, new Events::ClassCbEventListener<BaseTransport, Commanders::Command>(this, &BaseTransport::onCommanderCommand));
	}

	CLITransport::CLITransport(Commanders::BaseCommander* commander):
	BaseTransport::BaseTransport(commander)
	{

	}

	void CLITransport::open()
	{
		DWORD handleThreadId;
		CreateThread(NULL, 0, CLITransport::handleOutput, this, 0, &handleThreadId);
		this->handleInput();
	}

	void CLITransport::handleInput()
	{
		std::string command;
		this->_commander->update();
		// this->_commander->execute("{\"name\":\"startRecordingWindow\", \"data\":{\"id\":5}}");
		// this->_commander->execute("{\"name\":\"startRecordingWindow\", \"data\":{\"id\":4}}");
		while(std::getline(std::cin, command))
		{
			this->_commander->execute(command);
		}
	}

	void CLITransport::onCommanderCommand(Commanders::Command* command)
	{
		std::cout << command->value();
	}

	DWORD WINAPI CLITransport::handleOutput(LPVOID param)
	{
		CLITransport* transport = (CLITransport*)param;
		Commanders::BaseCommander* commander = transport->_commander;

		//timeouts go on in the commander
		while(1) commander->update();

		return 0;
	}
}