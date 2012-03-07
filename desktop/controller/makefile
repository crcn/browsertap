include ../../makefile.inc

#-----------------------------------------------------------

# source code inclues
IDIR = ./inc

# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

BDIR = ./bin

LIBS = -lgdi32 -lkernel32 -luser32 -lws2_32 -lmingw32

CFLAGS :=  $(LIBS) -I$(IDIR) -I$(VDIR) $(EFLAGS) -Wall

# objects to compile
SOURCES := $(shell find $(SOURCEDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: cli


cli: $(OBJECTS)
	@cd $(BDIR); $(CC) $(OBJECTS) -o cli


$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BDIR)