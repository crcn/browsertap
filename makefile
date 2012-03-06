# recursively finds other makefiles and calls the given command

%:
	@find desktop provision site -name "makefile" -exec make recursive COMMAND=$@ MAKEFILE={} \;

recursive: 
	@cd `dirname $$MAKEFILE`; make $$COMMAND

