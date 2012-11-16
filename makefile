all:

install-application:
	cd application; npm i; 

install-application-superconf:
	ln -s /srv/browsertap/application/supervisord.conf /etc/supervisor/conf.d/browsertap.conf; supervisord reread; supervisord update;

install-puppeteer:
	cd puppet; npm i
	cd puppeteer; npm i

browser-ext:
	cd browser_extension/xtest; ./build.sh

desktop-player:
	cd desktop_player; make

wkm:
	cd wkm; make

