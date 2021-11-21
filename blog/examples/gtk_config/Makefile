CC = gcc
SRC_DIR = src
CFLAGS = -Wall -g -pipe -fPIC
LIBS = gtk4
CFLAGS += $(shell pkg-config --cflags $(LIBS))
LDFLAGS = $(shell pkg-config --libs $(LIBS))
LDFLAGS += -I$(SRC_DIR)
CPPFLAGS += -DGTK_DISABLE_SINGLE_INCLUDES
CPPFLAGS += -DGDK_DISABLE_DEPRECATED
EXE = configwatch

OBJS = $(patsubst src/%.c, src/%.o, $(wildcard src/*.c))

main : clean build       

build: $(OBJS)
	$(CC) $(OBJS) $(LDFLAGS) -o $(EXE) 

$(SRC_DIR)/%.o: $(SRC_DIR)/%.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

clean:
	$(RM) $(OBJS) $(EXE)
