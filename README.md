### Notes

- The architecture for eyebrowse must be kept as minimalistic as possible. In general, more moving parts = more bugs.
- All **design material** goes in `site/`, or `desktop/client/src/web`. Any other folder is for muah. 


### Structure

- `desktop/` - the app which sits on the desktop of each windows machine
	- `client/` - shown to the user - also sends commands to the controller
	- `player/` - the flash player for the controller
	- `controller/` - c# controller 
	- `wkm/` - window, keyboard, mouse c++ library

- `provision/` - provisions desktop applications using [ec2](http://aws.amazon.com/en/ec2/)
- `site/` - the website for eyebrowse
- `projects/` - project files


### Installation

#### 1. Download & Install [node.js](http://nodejs.org/) 
#### 2. Download & Install [git](http://code.google.com/p/git-osx-installer/)
#### 3. Go to the **directory where you want this project to live**, and call (copy & paste):

```bash
npm install mesh -g # needed for building eyebrowse
git clone git@github.com:crcn/eyebrowse.git eyebrowse
cd eyebrowse # change to the eyebrowse directory
npm install # install eyebrowse now
mesh make:site:debug make:desktop-client:debug
```

#### 4. Run it!

You can either run the site:

```bash
mesh run:site
```

OR you can run the client

```bash
mesh run:desktop-client
```

**Note: If you change anything, you'll need to call:**

```bash
mesh make:site:debug
mesh make:desktop-client:debug
```




