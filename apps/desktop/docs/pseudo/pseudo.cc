class Window : EventEmitter {
  // EVENT CLOSE
  // EVENT CHANGE
}

class System {
  std::vector<Window> windows();
}



class Signal {
  void on(EventListener);
  emit(int event);
}

class User {
  User(System sys) {
    
  }
}

class Client {
  Client(System sys, connection Signal) {

  }
}