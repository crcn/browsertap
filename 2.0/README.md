### BrowserTap 2.0

BrowserTap 2.0 will be an open-source core, with a closed-sourcea native desktop application that enables (likely) QA testers and engineers to enter their AWS credentials, to allow one-click creation of a Windows, etc instance to debug their application manually, broadcasted from a web browser running on said instance.

### user hooks

- entirely open source. enable people to run BT on their infastructure. Entices people to improve the core, while allowing a revenue generating biz model
- desktop software. Anyone can install the server on a host machine, but most will run with one-click AWS installs
- (if possible, not MVP) allow multiple user sessions for one machine (needed for multiple keyboards & mice). Need to hack into /dev/0

### Features

- dead-simple Mac app to start an instance, give it a local URL to tunnel to the instance, and auto-open in your local browser
- auto discover devices plugged in via USB and broadcast them via BT software.
