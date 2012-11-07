#ifndef _EVENTS_H_
#define _EVENTS_H_

#include <string>
#include <vector>
#include <map>


namespace Janitor
{
	template<typename Disposable>
	class Janitor;
}

namespace Events
{

	class BaseEventDispatcher;
	class BaseEventListener;

	/**
	 */

	class Event
	{
	public:
		static const char* CLOSE;
		static const char* DISPOSE;
		static const char* OPEN;
		static const char* UPDATE;

		Event(std::string type);

		friend class BaseEventDispatcher;

		std::string type();
		BaseEventDispatcher* target();
		BaseEventDispatcher* currentTarget();
		BaseEventListener* listener();

	private:
		std::string _type;
		BaseEventDispatcher* _target;
		BaseEventDispatcher* _currentTarget;
		BaseEventListener* _listener;
	};


	/**
	 */

	class BaseEventDispatcher
	{
	protected:
		std::map<std::string, std::vector<BaseEventListener*>* > _eventListeners;
	public:
		virtual void addEventListener(std::string type, BaseEventListener* listener);
		bool removeEventListener(std::string type, BaseEventListener* listener);
		bool dispatchEvent(Event* event);
		~BaseEventDispatcher();
	};
	

	/**
	 */

	class EventDispatcher : public BaseEventDispatcher
	{

	private:
		std::vector<BaseEventListener*> _disposables;
		BaseEventListener* _disposableListener;


	public:
		EventDispatcher();
		void addEventListener(std::string type, BaseEventListener* listener);
		void onDisposed(Event* event);
		~EventDispatcher();
	};

	/**
	 */

	class BaseEventListener : public BaseEventDispatcher
	{
	public:
		friend class BaseEventDispatcher;
		void dispose() { };

	protected:	
		virtual void handleEvent(Event* event) = 0;
	};

	typedef void(*eventListener)(Event*);

	/**
	 */
	
	template <class T, class E>
	class ClassCbEventListener : public BaseEventListener
	{
	typedef void (T::*MethodType)(E* event);
	public:
		ClassCbEventListener(T* ptr, MethodType callback):
		_ptr(ptr),
		_listener(callback)
		{

		}
		void handleEvent(Event* event)
		{
			(this->_ptr->*_listener)((E*)event);
		}

	private:
		T* _ptr;
		MethodType _listener;
	};


	class CbEventListener : public BaseEventListener
	{
	public:
		CbEventListener(eventListener callback):
		_listener(callback)
		{

		}
		void handleEvent(Event* event)
		{
			this->_listener(event);
		}

	private:
		eventListener _listener;
	};



}

#endif