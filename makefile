all:

install-application:
	cd application
	npm i

install-puppeteer:
	cd puppet
	npm i
	cd ..
	cd puppeteer
	npm i

browser-ext:
	cd browser_extension/xtest; ./build.sh

desktop-player:
	cd desktop_player
	make

wkm:
	cd wkm
	make

