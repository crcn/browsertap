
all:
	find desktop provision site -name "makefile" -exec make runMakefile MAKEFILE={} \;


runMakefile: 
	@cd `dirname $$MAKEFILE`; make all