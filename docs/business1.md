#### user hooks

- entirely open source. enable people to run BT on their infastructure. Entices people to improve the core, while allowing a revenue generating biz model
- desktop software. Anyone can install the server on a host machine, but most will run with one-click AWS installs
- (if possible, not MVP) allow multiple user sessions for one machine (needed for multiple keyboards & mice). Need to hack into /dev/0

#### MVP Features

- dead-simple Mac app to start an instance, give it a local URL to tunnel to the instance, and auto-open in your local browser
- ability to run server on mac & windows
- synchronize *all* windows that popup on the server - vmware fusion style
- ability to tunnel local servers automatically by reading `/etc/host`.
- quick launch menu for starting frequently used apps

#### Future Features

Just some features to keep in mind to ensure we get some of the plumbing right.

- auto discover devices plugged in via USB and broadcast them via BT software.
- ability to install any application
- ensure that windows can be resized to any dimension
- ability to stream just the desktop
- drag & drop native applications to app -> upload & run them in the cloud.
  - Requires apps to be sandboxed, or identify where settings are stored.
  - need to Identify what architecture the app supports.
  - Maybe use some sort of puppet script for this.
- ability to share VM - screenhero style.

#### Crazy Features

- enable people to setup a server machine & get paid for hosting apps
  - security is an issue here - maybe have trusted hosts
  - get paid for old devices you're not using
  - would enable people to connect to nearby hosts - like torrenting.
  - enable people to do this for free as well
- run virtual box VMs on user's machine & broadcast screens back


#### target markets

- qa engineers & qa companies
  - rainforest QA
- dev companies that do virtualizations
