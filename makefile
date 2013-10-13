all:
	mesh build-src;

clean:
	rm -rf lib

all-watch:
	mesh build-src --watch --debug;


