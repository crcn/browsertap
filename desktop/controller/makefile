include ../../makefile.inc

#-----------------------------------------------------------


# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

BDIR = ./bin

LIBS = -lgdi32 

MINGWFLAGS := -static-libgcc -static-libstdc++
CFLAGS :=  -I./inc  -I./inc/windows -I./src $(EFLAGS) -Wall

# objects to compile
SOURCES := $(shell find $(SOURCEDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: cli


cli: $(OBJECTS)
	$(CC) $(OBJECTS) $(MINGWFLAGS) $(LIBS) -o $(BDIR)/cli


$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BDIR)