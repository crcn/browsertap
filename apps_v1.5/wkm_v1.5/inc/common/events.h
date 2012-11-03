#ifndef _EVENTS_H_
#define _EVENTS_H_

#include <string>
#include <vector>
#include <map>

namespace Events
{

	class Event
	{
	public:
		std::string type;

		Event(std::string type);
	};

	class BaseEventListener
	{
	public:
		friend class EventDispatcher;

	protected:	
		virtual void handleEvent(Event event) = 0;
	};

	class EventDispatcher
	{

	private:
		std::map<std::string, std::vector<BaseEventListener*>* > _eventListeners;

	public:
		void addEventListener(std::string type, BaseEventListener* listener);
		bool removeEventListener(std::string type, BaseEventListener* listener);
		bool dispatchEvent(Event event);
	};
}

#endif