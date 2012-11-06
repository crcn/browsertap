#ifndef PROCESS_H_
#define PROCESS_H_

#include <string>
#include <stdio.h>
#include <iostream>
#include <vector>
#include <windows.h>
#include "psapi.h"
#include "common/events.h"

namespace Process
{
	class ProcessManager;
	class Process;

	class ProcessEvent : public Events::Event
	{
	public:
		ProcessEvent(std::string type, Process* process);
		Process* process();
	private:
		Process* _process;
	};


	class Process : public Events::EventDispatcher
	{
	public:

		friend class ProcessManager;

		Process(DWORD pid, std::string name, std::string path);

		/**
		 */

		DWORD target();

		/**
		 */

		std::string path();

		/**
		 */

		std::string name();

		/**
		 * kill the process
		 */

		bool kill();

		/**
		 */

		bool isAlive();

	private:

		DWORD _pid;
		std::string _path;
		std::string _name;
		// void flagForKill();
		// bool 
	};


	// http://stackoverflow.com/questions/1008019/c-singleton-design-pattern
	class ProcessManager : public Events::EventDispatcher
	{
	public:

		/**
		 */

		static ProcessManager& instance()
		{
			static ProcessManager instance;
			return instance;
		}

		/**
		 */

		std::vector<Process*>& getAllProcesses();

		/**
		 */

		void update();
	private:

		/**
		 */

		std::vector<Process*> _processes;

		/**
		 */

		ProcessManager();

		/**
		 */

		Process* updateProcess(DWORD pid, char* name, char* path);

		/**
		 */

		void removeClosedProcesses(std::vector<Process*>& runningProcesses);

		/**
		 */

		ProcessManager(ProcessManager const&);

		/**
		 */

		void operator=(ProcessManager const&);
	};
}

#endif