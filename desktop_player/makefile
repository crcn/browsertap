include ../../makefile.inc

#-----------------------------------------------------------


# source dir
SDIR = ./src


BDIR = ../site/_assets/flash


#-----------------------------------------------------------

all: player


player: 
	/Applications/Adobe\ Flash\ Builder\ 4/sdks/4.6.0/bin/mxmlc $(SDIR)/DesktopPlayer.as -o ./bin/DesktopPlayer.swf
	cp ./bin/DesktopPlayer.swf ../http_client/lib/public/swf

