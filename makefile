#---------------------------------------------------

PROJ_DIR = projects
SRC_DIR = projects/src
APPS_DIR = projects/apps

#---------------------------------------------------



all: desktop_player web_debug sprite desktop_controller 
all_release: 


desktop_player:
	make -C $(SRC_DIR)/desktop_player all;

sprite:


web_debug:
	cd $(PROJ_DIR); mesh site:make:debug


web_release:
	cd $(PROJ_DIR); mesh site:make:release


web_run:
	cd $(PROJ_DIR); mesh site:run


desktop_controller:
	make -C $(SRC_DIR)/desktop_controller all;

clean:
	rm -rf $(APPS_DIR);