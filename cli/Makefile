# Get all arguments passed to make
ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

# Default target
all:
ifeq ($(strip $(ARGS)),)
	@echo "Usage: make run <arg> ..."
	@exit 1
endif 

run: 
	dart run bin/main.dart $(ARGS)
compile: 
	dart compile exe bin/main.dart -o ../run

# Catch-all target to prevent "make: *** No rule to make target ..." errors
%:
	@: