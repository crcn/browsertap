
#define WINVER 0x0500
#include "remote/transports.h"
#include "remote/commanders.h"


int main(int argc, const char* argv[])
{
	Commanders::JSONCommander* cmd = new Commanders::JSONCommander();
	Transports::CLITransport* transport = new Transports::CLITransport(cmd);
	transport->open();
}

