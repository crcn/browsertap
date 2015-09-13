### BrowserTap 2.0 [![Circle CI](https://circleci.com/gh/crcn/browsertap.svg?style=svg&circle-token=a50ad3ec92fd16e704ce88523ca0af5a77a15cbe)](https://circleci.com/gh/crcn/browsertap)


BrowserTap 2.0 will be an open-source core, with a closed-sourcea native desktop application that enables (likely) QA testers and engineers to enter their AWS credentials, to allow one-click creation of a Windows, etc instance to debug their application manually, broadcasted from a web browser running on said instance.


### Structure

Here's the general folder structure for v2 of BrowserTap:

```
apps/ - all application sources that need to get compiled
docs/ - various docs, wikis, business plans, etc.
home/ - the main home page
  build/ - built JS 
old/ - old files
```

#### Apps 

Below are a set apps to be developed

- [Home](./apps/home) - Home application
- [API](./apps/api) - orchestration, billing, *all* backend related stuff
- [browser client](./apps/browser-client) - web client which launches browsers
- [desktop client](./apps/desktop-client) - desktop client people can install from the app store
- [desktop server](./apps/desktop-server) - connects to the API server and does all the signaling for desktop. Also does cleanup when a user logs out.
- [desktop](./apps/desktop) - desktop controller. Does magical webrtc shit and other nice things.

#### Roadmap

- [x] setup authentication
  - [x] login
  - [x] signup
  - [x] sign up verification
  - [x] forgot password
  - [x] reset password email
  - [x] reset password
  - [x] store session (there's always a session)
  - [ ] re-send confirmation email
  - [ ] track last login
- [ ] security
  - [ ] lock account after N minutes
  - [ ] CSRF token
- [ ] speed
  - FE and website hosted on EC2
  - VMs hosted on EC2 and azure
- [ ] deployment
  - [ ] use appm for hosting apps & their versions
  - [ ] ability to point to private appm registry
- [ ] plans
  - [ ] free 30 minutes
  - [ ] integrate stripe
  - [ ] charge users for time used
  - [ ] free promotional minutes
- [ ] support
  - [ ] bug report form (include screenshot if possible)
  - [ ] ability for people to log directly into session
- [ ] collaboration
  - [ ] ability for people to share mouse & keyboard of particular device
  - [ ] ability for people to share a particular screen
- [ ] promotion
  - [ ] add promo codes for free minutes
  - [ ] invite more people to get early access
  - [ ] shortcode service
- desktop app features
- common features
  - [ ] ability to SSH into machine
  - [ ] automatically sync localhost to remote machine
  - [ ] sync all open windows to user
  - [ ] ability to see desktop or all windows
  - [ ] ability to run JS unit tests in browsers
  - [ ] appm for installing apps
  - [ ] mac & linux vms
  - [ ] clipboard support
  - [ ] geo location testing
  - [ ] ability to invite people into organization
    - [ ] need to accept link sent via email
    - [ ] need to be able to sign up or log in from link
  - [ ] ability to have multiple organizations
  - [ ] ability to set app hotkeys
  - [ ] ability to take a screenshot
  - [ ] sniff traffic and sync current location to btap
- [ ] nice features
  - [ ] resize windows to any size
  - [ ] sync audio
  - [ ] ability to invite people to session
  - [ ] ability to install any browser plugin (using robot)

- [ ] core
  - [ ] report bugs to github