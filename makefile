
DIRS := desktop provision site
# recursively finds other makefiles and calls the given command

%:
	@find $(DIRS) -name "makefile" -exec $(MAKE) recursive COMMAND=$@ MAKEFILE={} --no-print-directory \;

recursive: 
	@$(MAKE) -C `dirname $$MAKEFILE` $$COMMAND

