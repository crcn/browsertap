all:

install-application:
	npm cache clear; cd application; rm -rf node_modules; npm i; 

install-application-superconf:
	ln -s /srv/browsertap/application/supervisord.conf /etc/supervisor/conf.d/browsertap.conf; supervisord reread; supervisord update;

install-puppeteer:
	npm cache clear; cd puppet; rm -rf node_moduls; npm i; npm cache clear; cd puppeteer; rm -rf node_modules; npm i

browser-ext:
	cd browser_extension/xtest; ./build.sh

desktop-player:
	cd desktop_player; make

wkm:
	cd wkm; make

