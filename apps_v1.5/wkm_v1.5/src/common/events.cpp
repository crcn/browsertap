#include "common/events.h"
#include <algorithm>
#include <stdio.h>
#include <iostream>

namespace Events
{
	Event::Event(std::string type):
	_type(type),
	_target(0),
	_currentTarget(0),
	_listener(0) { }

	std::string Event::type()
	{
		return this->_type;
	}

	BaseEventDispatcher* Event::target()
	{
		return this->_target;
	}

	BaseEventDispatcher* Event::currentTarget()
	{
		return this->_currentTarget;
	}

	BaseEventListener* Event::listener()
	{
		return this->_listener;
	}


	const char* Event::OPEN    = "open";
	const char* Event::CLOSE   = "close";
	const char* Event::UPDATE  = "update";
	const char* Event::DISPOSE = "dispose";

	EventDispatcher::EventDispatcher()
	{
		this->_disposableListener = new ClassCbEventListener<EventDispatcher>(this, &EventDispatcher::onDisposed);
	}


	void EventDispatcher::onDisposed(Event* event)
	{
		std::map<std::string, std::vector<BaseEventListener*>* >::iterator it = this->_eventListeners.begin();

		std::vector<std::string> events;


		for(; it != this->_eventListeners.end(); it++) 
		{
			std::vector<BaseEventListener*>* listeners = it->second;
			std::vector<BaseEventListener*>::iterator it2 = std::find(listeners->begin(), listeners->end(), (BaseEventListener*) event->target());

			if(it2 != listeners->end()) 
			{
				events.push_back(it->first);
			}
		}

		for(int i = events.size(); i--;) 
		{
			this->removeEventListener(events.at(i), (BaseEventListener*) event->target());
		}
	}



	void BaseEventDispatcher::addEventListener(std::string type, BaseEventListener* listener)
	{
		if(this->_eventListeners[type] == 0) 
		{
			this->_eventListeners[type] = new std::vector<BaseEventListener*>();
		}

		std::vector<BaseEventListener*>* listeners = this->_eventListeners[type];
		std::vector<BaseEventListener*>::iterator it = std::find(listeners->begin(), listeners->end(), listener);

		if(it == listeners->end()) 
		{	
			listeners->push_back(listener);
		}
	}

	void EventDispatcher::addEventListener(std::string type, BaseEventListener* listener)
	{
		BaseEventDispatcher::addEventListener(type, listener);

		std::vector<BaseEventListener*>::iterator it = std::find(this->_disposables.begin(), this->_disposables.end(), listener);

		if(it == this->_disposables.end()) {
			this->_disposables.push_back(listener);
			listener->addEventListener(Event::DISPOSE, this->_disposableListener);
		}
	}


	bool BaseEventDispatcher::removeEventListener(std::string type, BaseEventListener* listener) 
	{
		std::vector<BaseEventListener*>* listeners = this->_eventListeners[type];

		if(listeners == NULL) return false;


		std::vector<BaseEventListener*>::iterator it = std::find(listeners->begin(), listeners->end(), listener);
		if(it != listeners->end()) 
		{
			listeners->erase(it);
		}

		if(listeners->size() == 0) 
		{
			delete this->_eventListeners[type];
			this->_eventListeners[type] = 0;
		}

		return false;
	}

	bool BaseEventDispatcher::dispatchEvent(Event* event) 
	{
		std::vector<BaseEventListener*>* listeners = this->_eventListeners[event->_type];

		if(listeners == 0) return false;

		for(int i = listeners->size(); i--;) 
		{
			BaseEventListener* listener = listeners->at(i);
			event->_listener = listener;
			if(event->_target == 0) event->_target = this;
			event->_currentTarget = this;
			listeners->at(i)->handleEvent(event);
		}

		delete event;

		return true;
	}

	BaseEventDispatcher::~BaseEventDispatcher()
	{
		this->dispatchEvent(new Event(Event::DISPOSE));
	}

	EventDispatcher::~EventDispatcher()
	{
		delete this->_disposableListener;
	}
}