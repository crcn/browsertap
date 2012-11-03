#include "common/events.h"


namespace Events
{
	Event::Event(std::string type):
	type(type) { }

	void EventDispatcher::addEventListener(std::string type, BaseEventListener* listener)
	{
		if(this->_eventListeners[type] == NULL) {
			this->_eventListeners[type] = new std::vector<BaseEventListener*>();
		}

		this->_eventListeners[type]->push_back(listener);
	}

	bool EventDispatcher::removeEventListener(std::string type, BaseEventListener* listener) 
	{
		std::vector<BaseEventListener*>* listeners = this->_eventListeners[type];

		if(listeners == NULL) return false;

		for(int i = listeners->size(); i--;) 
		{
			BaseEventListener* listener2 = listeners->at(i);

			if(listener == listener2) 
			{
				listeners->erase(listeners->begin() + i);
				return true;
			}
		}

		if(listeners->size() == 0) {
			delete this->_eventListeners[type];
		}

		return false;
	}

	bool EventDispatcher::dispatchEvent(Event event) 
	{
		std::vector<BaseEventListener*>* listeners = this->_eventListeners[event.type];

		if(listeners == NULL) return false;

		for(int i = listeners->size(); i--;) 
		{
			listeners->at(i)->handleEvent(event);
		}

		return true;
	}
}