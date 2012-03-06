# recursively finds other makefiles and calls the given command

%:
	@find desktop provision site -name "makefile" -exec $(MAKE) recursive COMMAND=$@ MAKEFILE={} --no-print-directory \;

recursive: 
	@$(MAKE) -C `dirname $$MAKEFILE` $$COMMAND

