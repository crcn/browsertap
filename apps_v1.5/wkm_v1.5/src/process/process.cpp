#include "process/process.h"



namespace Process
{

	ProcessEvent::ProcessEvent(std::string type, Process* process):
	Events::Event(type),
	_process(process)
	{

	}

	Process* ProcessEvent::process()
	{
		return this->_process;
	}


	Process::Process(DWORD pid, std::string name, std::string path)
	:_pid(pid),
	_path(path),
	_name(name) { }


	DWORD Process::target()
	{
		return this->_pid;
	}

	std::string Process::path() 
	{
		return this->_path;
	}

	std::string Process::name()
	{
		return this->_name;
	}

	bool Process::kill()
	{
		return FALSE;
	}

	bool Process::isAlive()
	{
		return FALSE;
	}

	ProcessManager::ProcessManager()
	{
	}

	std::vector<Process*>& ProcessManager::getAllProcesses()
	{
		this->update();
		return this->_processes;
	}

	void ProcessManager::update()
	{
		DWORD ap[1024], cbn, cp;

		if(!EnumProcesses(ap, sizeof(ap), &cbn)) return;

		cp = cbn / sizeof(DWORD);

		std::vector<Process*> runningProcesses;

		for(int i = 0, n = cp; i < n; i++) 
		{
			DWORD pid = ap[i];
			HANDLE hproc = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, pid);

			if(hproc == 0) continue;

			HMODULE hmod;
			DWORD cbn2;

			if(EnumProcessModules(hproc, &hmod, sizeof(hmod), &cbn2))
			{
				char path[MAX_PATH];
				char name[MAX_PATH];

				if(GetModuleFileNameEx(hproc, 0, path, MAX_PATH)) 
				{
					if(GetModuleBaseName(hproc, 0, name, MAX_PATH)) 
					{
						runningProcesses.push_back(this->updateProcess(pid, name, path));
					}
				}
			}


			CloseHandle(hproc);
		}

		this->removeClosedProcesses(runningProcesses);
	}

	Process* ProcessManager::updateProcess(DWORD pid, char* name, char* path)
	{
		for(int i = this->_processes.size(); i--;)
		{
			Process* proc = this->_processes[i];
			if(!strcmp(proc->path().c_str(), path) && (proc->target() == pid)) 
			{
				return proc; 
			}
		}

		Process* proc = new Process(pid, name, path);
		this->dispatchEvent(new ProcessEvent(Events::Event::OPEN, proc));
		return proc;
	}

	Process* ProcessManager::findProcessById(DWORD pid)
	{
		for(int i = this->_processes.size(); i--;)
		{
			Process* proc = this->_processes[i];
			if(proc->target() == pid) 
			{
				return proc;
			}
		}

		return 0;
	}

	void ProcessManager::removeClosedProcesses(std::vector<Process*>& runningProcesses) 
	{
		int nrp = runningProcesses.size();
		int np  = this->_processes.size();
		std::vector<Process*> closed;

		for(int i = np; i--;)
		{
			bool running = false;
			Process* proc = this->_processes.at(i);

			for(int j = nrp; j--;)
			{
				Process* rproc = runningProcesses.at(j);

				if(proc == rproc) {
					running = true;
					break;
				}
			}

			if(!running)
			{
				closed.push_back(proc);
			}
		}

		this->_processes = runningProcesses;

		for(int j = closed.size(); j--;)
		{
			Process* proc = closed[j];
			this->dispatchEvent(new ProcessEvent(Events::Event::CLOSE, proc));
			delete proc;
		}
	}
}