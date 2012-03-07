include ../../makefile.inc

#-----------------------------------------------------------


# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

BDIR = ./bin

LIBS = -lgdi32 -lkernel32 -luser32 -lws2_32 -lmingw32

CFLAGS :=  $(LIBS) -I./inc/common -I./inc/windows $(EFLAGS) -Wall

# objects to compile
SOURCES := $(shell find $(SOURCEDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: cli


cli: $(OBJECTS)
	$(CC) $(OBJECTS) -o $(BDIR)/cli


$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BDIR)