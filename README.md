### BrowserTap 2.0


BrowserTap 2.0 will be an open-source core, with a closed-sourcea native desktop application that enables (likely) QA testers and engineers to enter their AWS credentials, to allow one-click creation of a Windows, etc instance to debug their application manually, broadcasted from a web browser running on said instance.


### Structure

Here's the general folder structure for v2 of BrowserTap:

```
apps/ - all application sources that need to get compiled
  cc/ - all C++ sources that need to be bundled into binaries
  js/ - all JavaScript-based applications. Either node or built
docs/ - various docs, wikis, business plans, etc.
home/ - the main home page
  build/ - built JS 
```

#### Apps 

Below are a set apps to be developed

- [Home](./apps/home) - Home application
- [API](./apps/api) - orchestration, billing, *all* backend related stuff
- [browser client](./apps/browser-client) - web client which launches browsers
- [desktop client](./apps/desktop-client) - desktop client people can install from the app store
- [desktop server](./apps/desktop-server) - connects to the API server and does all the signaling for desktop. Also does cleanup when a user logs out.
- [desktop](./apps/desktop) - desktop controller. Does magical webrtc shit and other nice things.