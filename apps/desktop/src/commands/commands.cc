#include "./commands.h"

/**
 */

mesh::Response* app::PongBus::execute(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("pong!");
}

/**
 */

app::Commands::Commands(base::Application* app):app(app) {
  LOG_INFO("init commands");

  this->app->bus = (new mesh::CommandsBus(app->bus))
  ->add("ping", new app::PongBus(app));
}