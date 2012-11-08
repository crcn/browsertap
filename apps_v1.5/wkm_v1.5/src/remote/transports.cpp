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
		CreateThread(NULL, 0, CLITransport::handleInput, this, 0, &handleThreadId);
		this->handleOutput();
	}

	DWORD WINAPI CLITransport::handleInput(LPVOID param)
	{
		CLITransport* transport = (CLITransport*)param;
		std::string command;
		transport->_commander->update();
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
		std::cout << "<<<<<" << command->value() << ">>>>>";
	}

	void CLITransport::handleOutput()
	{
		Commanders::BaseCommander* commander = this->_commander;

		//timeouts go on in the commander
		while(1) commander->update();
	}
}