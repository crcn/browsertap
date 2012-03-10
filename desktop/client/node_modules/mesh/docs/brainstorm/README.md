I typically write notes down for myself to solve problems I'm having with designing an application


There are three phases to mesh:

1. bootstrap - writing boilerplate code for target platforms
2. merge - merging code from different directories for a target platform
3. building for a specific platform, whether combining source, or in binary form


### Mesh bootstrap phase:

1. `mesh bootstrap --all` - include ALL platforms
2. project generated:

- `makefile` - contains make args for all platforms, along with build script (mesh MUST be added to `package.json`)
- `manifest.json` - json config which explains build phases for particular platforms: mobile, browser, desktop
- `src/` - the source directory
	- `node/` - platform specific library
		- `mesh.json` - explains how a file is built

	- `node web/` - mixed platform libraries

### Mesh build phase:


1. `make node`
2. Mesh scans the `./src` directory. folders include `node`, `common`, `node web`, and `web`.
3. `node`, `common`, and `node web` are copied to the 