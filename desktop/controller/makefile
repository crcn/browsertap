
#---------------------------------------------------
CC=gcc

# source code inclues
IDIR=./inc

# source dir
SDIR=./src

# third-party source code headers to include
VDIR=./vendors

BDIR=./bin

CFLAGS=-I$(IDIR) -I$(VDIR) $(EFLAGS)

# objects to compile
OBJS=cli.o

LIBS = 

#---------------------------------------------------

all: cli


cli: $(OBJS)
	cd $(BDIR); $(CC) $(OBJS) -o cli


%.o: $(SDIR)/%.cpp
	@mkdir -p $(BDIR)
	$(CC) $(CFLAGS) -c $< -o $(BDIR)/$@

clean:
	rm -rf bin