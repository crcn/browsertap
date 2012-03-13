
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

### Commands

- `cbd run-web eyebrowse` - make & run eyebrowse
- `cbd make-web eyebrowse` - just make eyebrowse, don't run.
- `cbd publish eyebrowse "your commit message"` - commit eyebrowse to github.


### Resources

- [Jekyll](http://jekyllrb.com/) - used for generating the static website
- [Less CSS](http://lesscss.org/) - used for CSS templates
- [Mustache](http://mustache.github.com/) - used for HTML templates
- [Cupboard](https://github.com/crcn/cupboard) - used to manage projects on your system
- [Mesh](https://github.com/crcn/mesh) - build system used for the project


### Requirements

- [Node.js](http://nodejs.org/) - used for the build system
- [Macports](http://www.macports.org/), or [Homebrew](http://mxcl.github.com/homebrew/) - used for installing additional deps required by TD
- [Mesh](https://github.com/crcn/mesh)


### Installation

After installing [Node.js](http://nodejs.org/), open terminal, and copy & paste this script:

```bash
npm install mesh -g # needed for building eyebrowse
npm install cupboard -g # needed for building eyebrowse
git clone git@github.com:crcn/eyebrowse.git eyebrowse
cd eyebrowse 
cbd init # add to your projects cupboard
cd projects
npm install # install eyebrowse now
```

#### 4. Run it!

From your terminal, call:

```bash
sudo cbd run-web eyebrowse;
```




