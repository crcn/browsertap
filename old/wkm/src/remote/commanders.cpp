#include "remote/commanders.h"

#include <iostream>
#include <windows.h>
#include "json/writer.h"
#include "screens/clipboard.h"

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

	JSONCommander::JSONCommander():
	_tick(0),
	_frameRate(24),
	_commands(new Events::EventDispatcher()) {
		this->_throttler = new Speed::Throttle(1000);
		#define regCommand(name, method) this->_commands->addEventListener(#name, new Events::ClassCbEventListener<JSONCommander, JSONCommand>(this, &JSONCommander::method));
	
		regCommand(listWindows, execListWindows)
		regCommand(closeWindow, execCloseWindow)
		regCommand(resizeWindow, execResizeWindow)
		regCommand(focusWindow, execFocusWindow)
		regCommand(getWindowData, execGetScreenData)
		regCommand(startRecordingWindow, execStartRecordingWindow)
		regCommand(stopRecordingWindow, execStopRecordingWindow)
		regCommand(fireWindowMouseEvent, execFireWindowMouseEvent)
		regCommand(fireWindowKeybdEvent, execFireWindowKeybdEvent)
		regCommand(findWindowByTitle, execFindWindowByTitle)
		regCommand(changeWindowRecordingQuality, changeWindowRecordingQual)
		regCommand(setClipboard, execSetClipboard)


		#undef regCommand

		Screens::ScreenManager::instance().update();
		Screens::ScreenManager::instance().addEventListener(Events::Event::OPEN, new Events::ClassCbEventListener<JSONCommander, Screens::ScreenEvent>(this, &JSONCommander::onOpenWindow));
		Screens::ScreenManager::instance().addEventListener(Events::Event::CLOSE, new Events::ClassCbEventListener<JSONCommander, Screens::ScreenEvent>(this, &JSONCommander::onCloseWindow));
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

		if(!this->_throttler->skip())
		{
			Screens::ScreenManager::instance().update();
			if(Screens::Clipboard::instance().hasChanged()) 
			{
				this->dispatchCommand("setClipboard", Json::Value(Screens::Clipboard::instance().getValue()));
			}
		}


		int fps = this->_frameRate; 
		int ms  = (1/(double)fps)*1000;


		std::vector<Screens::Screen*> screens = Screens::ScreenManager::instance().allScreens();
		for(int i = screens.size(); i--;)
		{
			//update's mostly the recorder
			screens.at(i)->update();
		}

		Sleep(ms);
	}

	Json::Value getScreenData(Screens::Screen* screen)
	{
		Json::Value jwin;
		Json::Value jproc;

		Process::Process* proc = screen->process();

		//could be desktop window
		if(proc != 0)
		{
			jproc["path"] = proc->path();
			jproc["name"] = proc->name();
			jwin["process"] = jproc;
		}	

		Geometry::Rectangle bounds = screen->bounds();

		jwin["title"] = screen->title();
		jwin["className"] = screen->className();
		jwin["style"] = (double) screen->style();
		jwin["extStyle"] = (double) screen->extStyle();
		jwin["width"] = bounds.width;
		jwin["height"] = bounds.height;
		jwin["id"] = screen->id();
		jwin["parent"] = screen->parent();
		return jwin;
	}

	Json::Value getSuccess(bool succ)
	{
		Json::Value value;
		value["success"] = succ;
		return value;
	}

	int getDataId(Json::Value value)
	{
		return value["data"]["id"].asInt();
	}

	void JSONCommander::execGetScreenData(JSONCommand* command)
	{
		
		Screens::Screen* screen = 0;

		if(!(screen = this->getScreen(command))) return;

		this->dispatchResponse(command->value(), getScreenData(screen));
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

		this->dispatchResponse(command->value(), jwindows);
	}

	void JSONCommander::execCloseWindow(JSONCommand* command)
	{
		int id = command->value()["data"]["id"].asInt();
		
		this->dispatchResponse(command->value(), getSuccess(Screens::ScreenManager::instance().closeScreen(id)));
	}

	void JSONCommander::execSetClipboard(JSONCommand* command) 
	{
		std::cout << "set clipboard to: " << command->value()["data"].asString() << std::endl;
		Screens::Clipboard::instance().setValue(command->value()["data"].asString());
		this->dispatchResponse(command->value(), getSuccess(true));
	}

	void JSONCommander::execResizeWindow(JSONCommand* command)
	{
		Json::Value data = command->value()["data"];
		int id = data["id"].asInt();
		Json::Value x = data["x"], y = data["y"], w = data["w"], h = data["h"];


		Screens::Screen* screen = Screens::ScreenManager::instance().getScreen(id);

		if(screen == 0) return this->dispatchResponse(command->value(), getSuccess(false));
		

		Geometry::Rectangle rect = screen->bounds();

		if(!x.isNull()) rect.x      = x.asInt();
		if(!y.isNull()) rect.y      = y.asInt();
		if(!w.isNull()) rect.width  = w.asInt();
		if(!h.isNull()) rect.height = h.asInt();


		screen->resize(rect);

		this->dispatchResponse(command->value(), getSuccess(true));
	}

	void JSONCommander::execFocusWindow(JSONCommand* command)
	{
		Screens::Screen* screen = 0;

		if(!(screen = this->getScreen(command))) return;

		this->dispatchResponse(command->value(), getSuccess(screen->focus()));
	}

	#define ATTACH_CTX(name, method) \
		val = command->value()["data"][#name]; \
		if(!val.isNull()) \
		screen->recorder()->context()->name = val.method();

	void JSONCommander::execStartRecordingWindow(JSONCommand* command)
	{
		Screens::Screen* screen = 0;

		Json::Value out = command->value()["data"]["output"];

		if(out.isNull()) return this->dispatchResponse(command->value(), getSuccess(false));
		if(!(screen = this->getScreen(command))) return;

		Json::Value val;

		ATTACH_CTX(gop_size, asInt)
		ATTACH_CTX(qmin, asInt)
		ATTACH_CTX(qmax, asInt)
		ATTACH_CTX(frame_rate, asInt)
		this->changeCommanderQaul(command);

		screen->recorder()->start(out.asString());
	}

	void JSONCommander::execFindWindowByTitle(JSONCommand* command) 
	{
		std::string title = command->value()["data"].asString();

		std::vector<Screens::Screen*> screens = Screens::ScreenManager::instance().allOpenScreens();

		int n = screens.size();
		Screens::Screen* screen = NULL;

		for(int i = 0; i < n; i++)
		{
			screen = screens[i];
			if(std::string::npos != screen->title().find(title)) 
			{
				this->dispatchResponse(command->value(), getScreenData(screen));
				return;
			}
		}

		return this->dispatchResponse(command->value(), getSuccess(false));
	}

	void JSONCommander::changeWindowRecordingQual(JSONCommand* command)
	{
		Screens::Screen* screen = 0;


		if(!(screen = this->getScreen(command))) return;


		Json::Value val;

		ATTACH_CTX(gop_size, asInt)
		ATTACH_CTX(qmin, asInt)
		ATTACH_CTX(qmax, asInt)
		ATTACH_CTX(frame_rate, asInt)

		this->changeCommanderQaul(command);
		screen->recorder()->updateQuality();
	}

	void JSONCommander::changeCommanderQaul(JSONCommand* command) 
	{
		Json::Value val = command->value()["data"]["frame_rate"];

		if(!val.isNull()) 
		{
			this->_frameRate = val.asInt();
		}
	}


	void JSONCommander::execStopRecordingWindow(JSONCommand* command)
	{
		Screens::Screen* screen = 0;

		if(!(screen = this->getScreen(command))) return;

		screen->recorder()->stop();
	}

	void JSONCommander::execFireWindowMouseEvent(JSONCommand* command)
	{
		Screens::Screen* screen = 0;

		if(!(screen = this->getScreen(command))) return;

		Json::Value data = command->value()["data"];
		int dwFlags = data["dwFlags"].asInt();
		int x       = data["x"].asInt();
		int y       = data["y"].asInt();
		int dwData  = data["dwData"].asInt();

		screen->mouse()->event(dwFlags, x, y, dwData);
	}

	void JSONCommander::execFireWindowKeybdEvent(JSONCommand* command)
	{
		Screens::Screen* screen = 0;

		if(!(screen = this->getScreen(command))) return;

		Json::Value data = command->value()["data"];
		int bvk     = data["bvk"].asInt();
		int bScan   = data["bScan"].asInt();
		int dwFlags = data["dwFlags"].asInt();


		screen->keyboard()->event(bvk, bScan, dwFlags);
	}

	Screens::Screen* JSONCommander::getScreen(JSONCommand* command)
	{
		int id = getDataId(command->value());

		Screens::Screen* screen = Screens::ScreenManager::instance().getScreen(id);

		if(screen == 0)
		{
			this->dispatchResponse(command->value(), getSuccess(false));
			return 0;
		} 

		return screen;
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