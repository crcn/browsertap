

### Project Structure

- `projects/` - the projects directory
	- `apps/` - the project OUTPUTS. **DO NOT** edit these files.
	- `src/` - the project **SOURCES**. Edit these files.
		- `site/` - the main website
		- `desktop_client/` - the application the user sees when interacting with the app
		- `desktop_client site/` - shared resources between the client app, and site which are *merged* together.
		- `...` - everything else is stuff you don't need to touch.
- `project_files/` - project files should go here - such as [textmate](http://macromates.com/), [sublime](http://www.sublimetext.com/), etc.
- `compilers/` - don't touch this - used for building stuff
- `designs/` - PSD files / designs go here
- `brainstorm/` - Your thoughts go here

### Terminal Commands

- `cbd run-web eyebrowse` - make & run eyebrowse
- `cbd make-web eyebrowse` - just make eyebrowse, don't run.
- `cbd publish eyebrowse "your commit message"` - commit eyebrowse to github.


### Videos

- [Installation](http://cl.ly/0G0L1u1a3F0Q0u0z293i)
- [Using The Project](http://cl.ly/2d1w0f0r2N1V1N3e0k1F)
- [Project Hot Reloading](http://cl.ly/421R1s2A0k0P0L2m023a)


### Resources

- [Jekyll](http://jekyllrb.com/) - used for generating the static website
- [Less CSS](http://lesscss.org/) - used for CSS templates
- [Mustache](http://mustache.github.com/) - used for HTML templates
- [Cupboard](https://github.com/crcn/cupboard) - used to manage projects on your system
- [Mesh](https://github.com/crcn/mesh) - build system used for the project


### Requirements

- [Node.js](http://nodejs.org/) - used to run the app
- [Mesh](https://github.com/crcn/mesh) - used to build the application
- [Macports](http://www.macports.org/) - used to install additional dependencies such as [git](http://git-scm.com/).


### Installation

After installing [Node.js](http://nodejs.org/), open terminal, and copy & paste this script:

```bash
sudo port install git-core
sudo npm install mesh -g
sudo npm install cupboard -g
sudo git clone git@github.com:crcn/eyebrowse.git eyebrowse
cd eyebrowse 
sudo cbd init
```

#### 4. Run it!

From your terminal, call:

```bash
sudo cbd run-web eyebrowse
```

### Tips

- To stop a process in terminal, call `ctrl+c`
- To sync the project with newest updates, call `git pull` in the project directory. Simply Call:

```bash
cd `cbd dir eyebrowse`;
git pull;
```




