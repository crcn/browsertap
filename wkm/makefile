include ../makefile.inc

#-----------------------------------------------------------


# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

BDIR = ../../apps/desktop_controller/bin
BDIR = ./bin

LIBS = -L./libs -L./vendors/jsoncpp/libs/mingw -ljson_mingw_libmt -luser32 -lgdi32 -lpsapi -lavcodec -lavdevice -lavformat -lavutil -lswscale -lavfilter

MINGWFLAGS := -static-libgcc -static-libstdc++
CFLAGS :=  -I./inc  -I./inc/windows -I./vendors/ffmpeg -I./vendors/jsoncpp/include -I./src $(EFLAGS) -Wall -O2
CFLAGS64 := -ftree-vectorize

# objects to compile
SOURCES := $(shell find $(SDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: cli


cli: $(OBJECTS)
	$(CC) $(OBJECTS) $(MINGWFLAGS) $(LIBS) -ftree-vectorize -m64 -O2 -D__STDC_CONSTANT_MACROS -o $(BDIR)/cli


copy: 
	cp ./libs/* ./bin

$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) -m64 $(CFLAGS) -c $< -o $@

clean:
	cd bin; rm -rf src; rm cli.exe;