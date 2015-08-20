
#---------------------------------------------------
# CC = x86_64-w64-mingw32-g++ #g++
CC = g++
LD = ld



#---------------------------------------------------


# source dir
SDIR = ./src

# third-party source code headers to include
VDIR = ./vendors

VPATH = control

#BDIR = ../../apps/desktop_controller/bin
BDIR = ./bin

#LIBS = -L./libs -L./vendors/jsoncpp/libs/mingw -ljson_mingw_libmt -luser32 -lgdi32 -lpsapi -lavcodec -lavdevice -lavformat -lavutil -lswscale -lavfilter

MINGWFLAGS := -static-libgcc -static-libstdc++
CFLAGS :=  -I./inc  -I./inc/windows -I./vendors/ffmpeg -I./vendors/jsoncpp/include -I./src $(EFLAGS) -Wall -O2
CFLAGS64 := -ftree-vectorize

# objects to compile
SOURCES := $(shell find $(SDIR) -name '*.cpp')
OBJECTS := $(addprefix $(BDIR)/,$(SOURCES:%.cpp=%.o))

#-----------------------------------------------------------

all: main

main: $(OBJECTS)
	$(CC) $(OBJECTS) $(LIBS) -o $(BDIR)/main

$(BDIR)/%.o: %.cpp
	@mkdir -p `dirname $@`
	$(CC) -m64 $(CFLAGS) -c $< -o $@
