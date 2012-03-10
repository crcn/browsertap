## The JavaScript Build System


## Motivation

- Ability to use the same libraries, same API's across multiple platforms without refactoring code.
- Some standardization for writing javascript-based apps (commonjs).
- Keeps platform-specific code separate from core implementation (common library).
- Flexible enough to customize build processes. 
- Ability to be very specific about a platform, e.g., `mesh make web:ie:6`, `mesh make web:firefox:7`
- Seamlessly communicate between two different javascript apps, e.g., web + node.
- To do other really cool stuff, e.g., serving single-page apps and static websites from the same code.


## Supports

- Web 
- Node.js

## Installation

```bash
npm install mesh -g
```

## Soon

- Browser Extensions: **Firefox**, **Safari**, **Chrome**, **IE**, **Opera**, **Bookmarklets**
- Soon: Titanium, Phonegap

## Prerequisites

- [Node.js](http://nodejs.org/) (needed for CLI)

## Basic Setup
	
We'll first kick things off by initializing our project. Call:

	mesh bootstrap


The bootstrap script will produce some boilerplate code. 
After you're done initializing your project, you can go ahead and make it:

```
mesh make:web:debug
mesh make:iphone:debug
mesh make:node:debug
```