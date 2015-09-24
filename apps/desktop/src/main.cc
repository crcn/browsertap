//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/desktop.h"
#include "./remote2/server.h"
#include "./wrtc/connection.h"
#include "./geom/bounds.h"
#include <json/json.h>
#include "./core/mesh/mesh.h"
#include "./application.h" 
#include "./core/thread/thread.h"
#include "./core/thread/mutex.h"
#include "./core/thread/condition.h"
#include <libwebsockets.h>



int main(int argc, const char * argv[]) {

  app::Application* app = new app::Application();
  app->start();

  struct libwebsocket_context *context;
struct lws_context_creation_info info;

info.port = 9000;
info.iface = NULL;
info.protocols = NULL;
// info.extensions = libwebsocket_get_internal_extensions();
info.ssl_cert_filepath = NULL;
info.ssl_private_key_filepath = NULL;
info.gid = -1;
info.uid = -1;
info.options = 0;

// context = libwebsocket_create_context(&info);
// if (context == NULL) {

  while(1) sleep(1);
}
