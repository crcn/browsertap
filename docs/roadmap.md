Tentative plan for building out the QA system to rule them all.

## 1. Eyebrowse

Eyebrowse is a desktop application that enables people to launch any application in their own personal cloud. Initially the desktop application would only support apps that are runnable under OSs supported on AWS, and possibly windows azure. 

#### Why would people use this?

1. Enables people to test against multiple platforms with different hardware specs.
2. Easily setup connected servers within a closed intranet.
3. Not limited to browser testing.
4. Users own servers & apps. Install anything you want on them.

#### Who is this for?

1. Engineers
2. QA testers
3. Support people (future)
4. People looking for a VNC alternative.

#### Explicit Features

1. Enable people to enter their AWS credentials and boot any supported application under APPM.
2. Enable people to install the remote desktop software (closed source) on any computer.
3. APPM would enable people to install any application version they want.
4. SSH / bash into any connected server.
5. Sync browser windows to users machine.

#### Implicit Features

1. Tunnel HTTP traffic to remote server.
2. GPS location can be explicitly set (maybe not possible).
3. connect camera, and other mic. 
4. copy keyboard layout from local machine.

#### Required Modules

Below are modules that are required for this sort of application to run.

1. APPM - application management CLI tool. Open source. Enables people to install any desktop application on their machine.
2. eyebrowse server - provisioned on the user's AWS account. Controls user accounts and provisions servers.
3. remote desktop software - uses webrtc. Enables people to control machines in the cloud.

## 2. Device Lending

Device lending service by Eyebrowse would allow people to loan their unused device to us in return for a share on profit. 

#### Why would people use this?

1. Passive income baby. Anyone can lend their device out.

#### How would this make other apps better?

1. Boost publicity. Not a service just for engineers. 
2. Enable people using eyebrowse to run an code on an array of devices - not just mobile.
3. Make device testing on the cloud cheaper than all other competitors.
4. Open eyebrowse up to a wider audience such as support people. 

#### Explicit features

1. Lend out loaned devices to companies that want devices to test locally. We'd basically give them a rack full of physical devices and eyebrowse server pre-installed. 

#### Required Modules

1. colocation center. Need a place to put devices in.
2. mobile phone controller. Most devices have protocols that enable you to programatically execute touch events.

## 3. Robo QA assistant

An artificially intelligent agent for automating quality assurance. The tool would basically work in tandem with Eyebrowse. It'd work by using visual information to go through flows.


#### How would this make other apps better?

1. Enable people to create automation flows for any device. 
2. No code required. 


## Other ideas

#### Eyebrowse Mobile

Run any device

