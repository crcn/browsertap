
#include "remote/transports.h"
#include "remote/commanders.h"
#include <iostream>


int main(int argc, const char* argv[])
{
	std::cout << "GG" << std::endl;
	Commanders::JSONCommander* cmd = new Commanders::JSONCommander();
	Transports::CLITransport* transport = new Transports::CLITransport(cmd);
	transport->open();
}

