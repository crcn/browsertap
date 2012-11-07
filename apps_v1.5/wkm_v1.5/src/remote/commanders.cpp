#include "remote/commanders.h"

#include <iostream>
#include <windows.h>
#include "json/writer.h"

namespace Commanders
{

	/**
	 */

	Command::Command(std::string type, std::string value):
	Events::Event(type),
	_value(value)
	{

	}

	const char * Command::COMMAND = "command";

	std::string Command::value()
	{
		return this->_value;
	}

	/**
	 */

	JSONCommand::JSONCommand(std::string type, Json::Value& value):
	Events::Event(type),
	_value(value)
	{

	}

	Json::Value& JSONCommand::value()
	{
		return this->_value;
	}

	/**
	 */

	DWORD WINAPI updateWindow(LPVOID param)
	{
		while(1)
		{
			Screens::ScreenManager::instance().update();
			Sleep(1000);
		}

		return 0;
	}

	/**
	 */

	JSONCommander::JSONCommander():
	_commands(new Events::EventDispatcher()) {
		#define regCommand(name, method) this->_commands->addEventListener(#name, new Events::ClassCbEventListener<JSONCommander, JSONCommand>(this, &JSONCommander::method));
	
		regCommand(listWindows, execListWindows)
		regCommand(closeWindow, execCloseWindow)

		#undef regCommand

		Screens::ScreenManager::instance().addEventListener(Events::Event::OPEN, new Events::ClassCbEventListener<JSONCommander, Screens::ScreenEvent>(this, &JSONCommander::onOpenWindow));
		Screens::ScreenManager::instance().addEventListener(Events::Event::CLOSE, new Events::ClassCbEventListener<JSONCommander, Screens::ScreenEvent>(this, &JSONCommander::onCloseWindow));


		//stick this on a timer
		DWORD threadId;
		CreateThread(NULL, 0, &updateWindow, this, 0, &threadId);
	}

	bool JSONCommander::execute(std::string command) 
	{

		Json::Value root;
		Json::Reader reader;
		if(!reader.parse(command, root)) return false;

		Json::Value commandName = root["name"];

		if(commandName.isNull()) return false;

		this->_commands->dispatchEvent(new JSONCommand(commandName.asString(), root));

		return true;
	}

	void JSONCommander::update()
	{
		Sleep(1000);
	}

	Json::Value getScreenData(Screens::Screen* screen)
	{
		Json::Value jwin;
		Json::Value jproc;
		jproc["path"] = screen->process()->path();
		jproc["name"] = screen->process()->name();
		jwin["title"] = screen->title();
		jwin["id"] = screen->id();
		jwin["process"] = jproc;
		return jwin;
	}

	Json::Value getSuccess(bool succ)
	{
		Json::Value value;
		value["success"] = succ;
		return value;
	}

	void JSONCommander::execListWindows(JSONCommand* command)
	{
		std::vector<Screens::Screen*> screens = Screens::ScreenManager::instance().allOpenScreens();

		int n = screens.size();
		Json::Value jwindows;
		jwindows.resize(n);

		for(int i = 0; i < n; i++)
		{
			jwindows[i] = getScreenData(screens[i]);
		}

		Json::StyledWriter writer;

		this->dispatchResponse(command->value(), jwindows);
	}

	void JSONCommander::execCloseWindow(JSONCommand* command)
	{
		int id = command->value()["data"]["id"].asInt();
		
		this->dispatchResponse(command->value(), getSuccess(Screens::ScreenManager::instance().closeScreen(id)));
	}


	void JSONCommander::onOpenWindow(Screens::ScreenEvent* event)
	{
		this->dispatchCommand("openWindow", getScreenData(event->screen()));
	}

	void JSONCommander::onCloseWindow(Screens::ScreenEvent* event)
	{
		this->dispatchCommand("closeWindow", getScreenData(event->screen()));
	}

	void JSONCommander::dispatchCommand(std::string name, Json::Value value)
	{
		Json::Value command;
		command["name"] = name;
		command["data"] = value;

		Json::FastWriter writer;

		this->dispatchEvent(new Command(Command::COMMAND, writer.write(command)));
	}

	void JSONCommander::dispatchResponse(Json::Value command, Json::Value value)
	{
		Json::Value response;
		response["replyTo"] = command["id"];
		response["data"] = value;

		Json::FastWriter writer;

		this->dispatchEvent(new Command(Command::COMMAND, writer.write(response)));
	}
}