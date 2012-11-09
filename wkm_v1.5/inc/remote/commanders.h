#ifndef COMMANDERS_H_
#define COMMANDERS_H_

#include "common/events.h"
#include "screens/screens.h"
#include "json/reader.h"

namespace Commanders
{

	class Command : public Events::Event
	{
	public:
		static const char * COMMAND;
		Command(std::string type, std::string value);
		std::string value();
	private:
		std::string _value;
	};


	class JSONCommand : public Events::Event
	{
	public:
		JSONCommand(std::string type, Json::Value& value);
		Json::Value& value();
	private:
		Json::Value& _value;
	};


	class BaseCommander : public Events::EventDispatcher
	{
	public:
		virtual bool execute(std::string command) = 0;
		virtual void update() = 0;
	};

	class JSONCommander: public BaseCommander
	{
	public:
		JSONCommander();
		bool execute(std::string command);
		void update();

	private:
		int _tick;
		Events::EventDispatcher* _commands;

		// void execTimeout(JSONCommand* event);

		void execListWindows(JSONCommand* event);
		void execCloseWindow(JSONCommand* event);
		void execResizeWindow(JSONCommand* event);
		void execFocusWindow(JSONCommand* event);
		void execStartRecordingWindow(JSONCommand* event);
		void execStopRecordingWindow(JSONCommand* event);
		void execShowWindowStatus(JSONCommand* event);
		Screens::Screen* getScreen(JSONCommand* event);

		// void execListProcesses(JSONCommand* event);
		// void execKillProcess(JSONCommand* event);

		void onOpenWindow(Screens::ScreenEvent* event);
		void onCloseWindow(Screens::ScreenEvent* event);

		void dispatchCommand(std::string name, Json::Value data);
		void dispatchResponse(Json::Value command, Json::Value data);
	};
}

#endif