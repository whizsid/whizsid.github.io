#include <gdk/gdk.h>

typedef struct {
    GdkRGBA background;
    GdkRGBA foreground;
} Config;

void config_file_apply_default(Config *config);

void config_file_parse(Config *config, GFile *file);

void config_file_watch(void (*ptr)(Config *config, void *args), void *args);
