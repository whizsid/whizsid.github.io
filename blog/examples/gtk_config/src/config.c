#include "config.h"
#include <gtk/gtk.h>
#include <stdlib.h>

typedef struct {
    void * args;
    void (*ptr)(Config *config, void *args);
} config_watch_args;

static void __config_file_changed(GFileMonitor *monitor, GFile *file,
                                  GFile *other_file,
                                  GFileMonitorEvent event_type, gpointer args) {
  Config *config = malloc(sizeof(Config));
  config_watch_args *targs = args;
  if (event_type == G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT) {
    config_file_apply_default(config);
    config_file_parse(config, file);
    targs->ptr(config, targs->args);
  }
  free(config);
}

void config_file_watch(void (*ptr)(Config *config, void *args), void *args) {
  GFile *file;
  GFileMonitor *config_monitor;
  GError *error = NULL;
  gchar *cf_path = malloc(sizeof(gchar) * 256);
  config_watch_args *targs = malloc(sizeof(config_watch_args));
  Config *init_config = malloc(sizeof(Config));

  g_strlcpy(cf_path, g_get_user_config_dir(), sizeof(gchar) * 256);
  cf_path = g_strconcat(cf_path, "/configwatch/cfgrc", NULL);
  file = g_file_new_for_path(cf_path);
  config_monitor =
      g_file_monitor(file, G_FILE_MONITOR_NONE, NULL, &error);
  if (error) {
    fprintf(stderr, "could not watch config file: %s\n", error->message);
    exit(EXIT_FAILURE);
  }

  config_file_apply_default(init_config);
  config_file_parse(init_config, file);
  ptr(init_config, args);

  targs->args = args;
  targs->ptr = ptr;
  g_signal_connect(config_monitor, "changed", G_CALLBACK(__config_file_changed),
                   targs);
}

void config_file_apply_default(Config *config) {
  gdk_rgba_parse(&config->background, "#000000");
  gdk_rgba_parse(&config->foreground, "#ffffff");
}

void config_file_parse(Config *config, GFile *file) {
  GKeyFile *kfile;
  GError *error = NULL;
  gchar *background = malloc(sizeof(gchar) * 30);
  gchar *foreground = malloc(sizeof(gchar) * 30);
  gboolean colparsed = FALSE;

  kfile = g_key_file_new();
  g_key_file_load_from_file(kfile, g_file_get_path(file), G_KEY_FILE_NONE,
                            &error);

  if (error) {
    fprintf(stderr, "could not parse the config file: %s\n", error->message);
    exit(EXIT_FAILURE);
  }

  g_strlcpy(
      background,
      g_key_file_get_value(kfile, "Preference", "BackgroundColor", &error),
      sizeof(gchar) * 30);
  if (error == NULL) {
    colparsed = gdk_rgba_parse(&config->background, background);
    if (colparsed != TRUE) {
      fprintf(stderr, "could not parse the background color.");
      exit(EXIT_FAILURE);
    }
  }

  error = NULL;

  g_strlcpy(
      foreground,
      g_key_file_get_value(kfile, "Preference", "ForegroundColor", &error),
      sizeof(gchar) * 30);
  if (error == NULL) {
    colparsed = gdk_rgba_parse(&config->foreground, foreground);
    if (colparsed != TRUE) {
      fprintf(stderr, "could not parse the foreground color.");
      exit(EXIT_FAILURE);
    }
  }
}
