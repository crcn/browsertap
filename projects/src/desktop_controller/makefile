include ../../../makefile.inc

#-----------------------------------------------------------


# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

BDIR = ../../apps/desktop_controller/bin
BDIR = ./bin

LIBS = -L./libs -lgdi32 -lavcodec -lavdevice -lavformat -lavutil -lswscale -lavfilter

MINGWFLAGS := -static-libgcc -static-libstdc++
CFLAGS :=  -I./inc  -I./inc/windows -I./vendors/ffmpeg -I./src $(EFLAGS) -Wall

# objects to compile
SOURCES := $(shell find $(SDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: cli


cli: $(OBJECTS)
	$(CC) $(OBJECTS) $(MINGWFLAGS) $(LIBS) -D__STDC_CONSTANT_MACROS -o $(BDIR)/cli


copy: 
	cp ./libs/* ./bin

$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BDIR)