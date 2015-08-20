Just a few notes about the struture here. Apps are separated into folders specific to the
language they're predominantly written in. This means that js/ might have applications that are *actually*
desktop apps and use native components such as native elements & gyp build files. The reason *why* apps are separate like this is to:

1. easily share common modules
2. easily share common test cases, scripts, and other build tools


#### TODOS

- [ ] - fill out makefile to build *all* app sources