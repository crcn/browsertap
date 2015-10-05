#ifndef APP_SYNC_WINDOWS_TASK_H_
#define APP_SYNC_WINDOWS_TASK_H_

#include "../core/events/event_listener.h"
#include "../active_records/virt_window.h"
#include "../core/thread/task.h"
#include "../core/virt/base/desktop.h"
#include "../core/virt/base/window.h"
#include "../core/active_record/collection.h"
#include "../core/shims/shims.h"
#include <map>

namespace app {
  class SyncWindowsTask : public core::Task, public core::EventListener {
  public:
    SyncWindowsTask(virt::Desktop* desktop, activeRecord::Collection* collection):
    _desktop(desktop),
    _collection(collection) {
      _desktop->addListener(this);
    }

    void* run() {

      while(1) {
        std::vector<virt::Window*> existingWindows   = _desktop->syncWindows();

        // insert
        for (int i = 0, n = existingWindows.size(); i < n; i++) {

          virt::Window* window      = existingWindows.at(i);
          app::VirtWindow* arWindow = _windowDictionary[window];

          if (arWindow == nullptr) {
            _windowDictionary[window] = arWindow = new app::VirtWindow(window);
            _collection->insert(arWindow);
          }

          _windowDictionary[window] = arWindow;
        }

        usleep(1000 * 100);
      }
    }

    void handleEvent(core::Event* event) {
      if (event->type == virt::WindowEvents::REMOVE) {
        virt::Window* window = (virt::Window*)event->data;
        app::VirtWindow* arWindow = _windowDictionary[window];
        if (arWindow != nullptr) {
          arWindow->remove();
          _windowDictionary.erase(window);
        }
      }
    }

  private:
    virt::Desktop* _desktop;
    activeRecord::Collection* _collection;
    std::map<virt::Window*, app::VirtWindow*> _windowDictionary;
  };
}

#endif
