# How to parse / watch / apply configuration file in GTK applications

Some UI dependent GTK applications need to be updated in real-time once
the configuration file changed. Most of developers re-implementing the
wheel while make it work. They have to waste their valuable time to 
play with threads and mutexes. But the Glib has a built-in way to 
accomplish this.

## Making a simple project

First I am making a simple GTK project with a simple makefile. And I am
adding the GTK +3 as a dependency to the makefile.

```make
# Makefile

CC = gcc
SRC_DIR = src
CFLAGS = -Wall -g
LIBS = gtk4
CFLAGS += $(shell pkg-config --cflags $(LIBS))
LDFLAGS = $(shell pkg-config --libs $(LIBS))
LDFLAGS += -I$(SRC_DIR)
EXE = configwatch

OBJS = $(patsubst src/%.c, src/%.o, $(wildcard src/*.c))

main : clean build       

build: $(OBJS)
	$(CC) $(OBJS) $(LDFLAGS) -o $(EXE) 

$(SRC_DIR)/%.o: $(SRC_DIR)/%.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	$(RM) $(OBJS) $(EXE)
```

Next I am creating a simple GTK application with only one button by
following their [official
documentation](https://docs.gtk.org/gtk4/getting_started.html#hello-world-in-c).
You can also copy and paste it from the above link.

```c
# main.c

#include <gtk/gtk.h>

static void
print_hello (GtkWidget *widget,
             gpointer   data)
{
  g_print ("Hello World\n");
}

static void
activate (GtkApplication *app,
          gpointer        user_data)
{
  GtkWidget *window;
  GtkWidget *button;
  GtkWidget *box;

  window = gtk_application_window_new (app);
  gtk_window_set_title (GTK_WINDOW (window), "Window");
  gtk_window_set_default_size (GTK_WINDOW (window), 200, 200);

  box = gtk_box_new (GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_set_halign (box, GTK_ALIGN_CENTER);
  gtk_widget_set_valign (box, GTK_ALIGN_CENTER);

  gtk_window_set_child (GTK_WINDOW (window), box);

  button = gtk_button_new_with_label ("Hello World");

  g_signal_connect (button, "clicked", G_CALLBACK (print_hello), NULL);
  g_signal_connect_swapped (button, "clicked", G_CALLBACK (gtk_window_destroy), window);

  gtk_box_append (GTK_BOX (box), button);

  gtk_widget_show (window);
}

int
main (int    argc,
      char **argv)
{
  GtkApplication *app;
  int status;

  app = gtk_application_new ("org.gtk.example", G_APPLICATION_FLAGS_NONE);
  g_signal_connect (app, "activate", G_CALLBACK (activate), NULL);
  status = g_application_run (G_APPLICATION (app), argc, argv);
  g_object_unref (app);

  return status;
}
```

Run below command to compile it and run.

```
$ make
$ ./configwatch
```

Now you can see a simple GTK application with a 'Hello World' button.

## Watching the configuration file.

Glib is providing a decent way to monitor file changes by [GFileMonitor
Interface](https://developer-old.gnome.org/gio/stable/GFileMonitor.html).
You can watch all changes made on the configuration file without wasting
time to playing with threads and mutexes.

Now I am going make a simple file to watch changes of the configuration 
file. First I am creating a header file for our source file.

```c
# src/config.h

void config_file_watch();
```

Next I will create the source file to watch configuration file stored in
my home directory.

```c
# src/config.c

#include <gtk/gtk.h>

// Callback to run after configuration file changed
static void __config_file_changed(GFileMonitor *monitor, GFile *file,
                               GFile *other_file, GFileMonitorEvent event_type,
                               gpointer args) {
    if(event_type == G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT) {
        g_print("File Changed\n");
    }
}

void config_file_watch() {
  GFile *file;
  GFileMonitor *config_monitor;
  GError *error = NULL;

  // Creating a file handler
  file = g_file_new_for_path("/home/ramesh/.config/configwatch/cfgrc");
  // Creating a handler to monitor the file
  config_monitor =
      g_file_monitor(file, G_FILE_MONITOR_NONE, NULL, &error);
  if (error) {
    fprintf(stderr, "could not watch preference file: %s\n", error->message);
    exit(EXIT_FAILURE);
  }
  // Binding the callback function
  g_signal_connect(config_monitor, "changed", G_CALLBACK(__config_file_changed), NULL);
  g_print("File Watching\n");
}
```

First I am creating a callback method with the signature given in [the
documentation](https://developer-old.gnome.org/gio/stable/GFileMonitor.html#GFileMonitor-changed).
And filtering only `G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT` events.
Because `G_FILE_MONITOR_EVENT_CHANGED` will be called multiple times
when a single byte wrote to the file. But the
`G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT` event is only called once at a
time.

In the `config_file_watch` method I used `G_FILE_MONITOR_NONE` flag,
because we have to watch only a single file. So we do not want to watch
mounts and move events.

In this step I hard-coded the file path. But the Glib is also providing
a way to get the user config directory in a handy way.

```c
# src/config.c

void config_file_watch() {
  // ...
  gchar *cf_path = malloc(sizeof(gchar)*256);

  g_strlcpy(cf_path, g_get_user_config_dir(), sizeof(gchar)*238);
  cf_path = g_strconcat(cf_path, "/configwatch/cfgrc", NULL);
  file = g_file_new_for_path(cf_path);
  // ...
}
```

By using the `g_get_user_config_dir` function you can get the config
directory of your home directory (`/home/<username>/.config`)

Now add the defined `config_file_watch` function before the GTK main-loop
in the `main.c` file.

```c
# src/main.c

#include "config.h"

// ...

int
main (int    argc,
      char **argv)
{
  // ...

  g_signal_connect (app, "activate", G_CALLBACK (activate), NULL);
  config_file_watch();

  // ...
}
```

Make and run the application. The program is printing below output to
the console when changing the configuration file in the
`/home/<user>/.config/configwatch/cfgrc` path.


```
$ make
$ ./configwatch 
File Watching
File Changed
File Changed
File Changed
Hello World
```

## Parsing the configuration file

You don't need to re-implement a configuration parser since Glib has
everything that you need to implement applications. The [GKeyFile](https://developer-old.gnome.org/glib/unstable/glib-Key-value-file-parser.html)
is enable you to parse your configuration file. As the first step I am
defining a struct to hold configuration file and method signatures in
the header file to parse the configuration file.

```c
# src/config.h

#include <gdk/gdk.h>

typedef struct {
    GdkRGBA background;
    GdkRGBA foreground;
} Config;

void config_file_apply_default(Config *config);

void config_file_parse(Config *config, GFile *file);

// ...
```

The first method will assign default values to the `Config` struct and
the second method will assign actual configuration values to the
`Config` file if available.

Next I am defining the above functions in the source file and testing it
inside the `__config_file_changed` function.

```c
# src/config.c

static void __config_file_changed(GFileMonitor *monitor, GFile *file,
                                  GFile *other_file,
                                  GFileMonitorEvent event_type, gpointer args) {
  Config *config = malloc(sizeof(Config));
  if (event_type == G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT) {
    config_file_apply_default(config);
    config_file_parse(config, file);
    g_print("File changed\n");

    g_print("Background=%s\nForeground=%s\n",
            gdk_rgba_to_string(&config->background),
            gdk_rgba_to_string(&config->foreground));
  }
  free(config);
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

```

I used the `gdk_rgba_parse` to parse the color codes to `GdkRGBA` type
and `gdk_rgba_to_string` to convert them back to strings. 

And used `g_key_file_new` to construct a `GKeyFile` instance,
`g_key_file_load_from_file` to load contents from the file into the
`GKeyFile` and used `g_key_file_get_value` to retrieve the configuration
value by the given group name and key name.

Check the above change by creating/changing the configuration file for
following format.

```
# ~/.config/configwatch/cfgrc

[Preference]
BackgroundColor=#000000
ForegroundColor=#ffffff
```

## Making configuration functions abstract

If you need to use the `config_file_watch` function in multiple
subpojects, You can make it to an abstract function.

```c
# src/config.h

// ...
void config_file_watch(void (*ptr)(Config *config, void *args), void *args);
```

I am taking a callback and a data pointer as arguments for
`config_file_watch` method. This callback should be called in each time
after configuration file changed.

```c
# src/config.c

typedef struct {
    void * args;
    void (*ptr)(Config *config, void *args);
} config_watch_args;

static void __config_file_changed(GFileMonitor *monitor, GFile *file,
                                  GFile *other_file,
                                  GFileMonitorEvent event_type, gpointer args) {
  // ...
  config_watch_args *targs = args;
  if (event_type == G_FILE_MONITOR_EVENT_CHANGES_DONE_HINT) {
    // ...
    targs->ptr(config, targs->args);
  }
  // ...
}


void config_file_watch(void (*ptr)(Config *config, void *args), void *args) {
  // ...

  config_watch_args *targs = malloc(sizeof(config_watch_args));
  
  // ...

  targs->args = args;
  targs->ptr = ptr;
  g_signal_connect(config_monitor, "changed", G_CALLBACK(__config_file_changed),
                   targs);

}
```

First I defined a struct to interchange data and callback between the 
internal callback and the main thread. Then I assigned the passed 
callback and data to the struct inside the `config_file_watch` function.
After I called to the passed callback with providing the parsed
configuration struct and the data as an argument inside 
the `__config_file_changed` callback.

## Reloading the CSS styles

Now I have to reload the CSS in the application with the colours in the
configuration file. To reload the CSS, I have to define a `CSSProvider`
to use across in the application. I am defining a struct to hold the CSS
provider across the application scope.

```c
# src/main.c

#include <gtk/gtkcssprovider.h>

// ...

typedef struct {
  GtkCssProvider *style_provider;
} MyApp;
MyApp myapp;
```

And I am binding the CSS provider to the required widgets and assigning
an unique id for each required widgets.

```c
# src/main.c

static void activate(GtkApplication *app, gpointer user_data) {
  // ...

  button = gtk_button_new_with_label("Hello World");

  gtk_widget_set_name(GTK_WIDGET(button), "helloworldbutton");
  gtk_style_context_add_provider(gtk_widget_get_style_context(button),
                                 GTK_STYLE_PROVIDER(myapp.style_provider),
                                 GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);

  // ...
}

int main(int argc, char **argv) {
  // ...

  myapp.style_provider = gtk_css_provider_new();
  status = g_application_run(G_APPLICATION(app), argc, argv);

  // ...
}
```

I assigned the id 'helloworldbutton' to the button using the
`gtk_widget_set_name` function and bind the CSS provider to the button
using `gtk_style_context_add_provider` function.

And I initialized the `css_provider` before the main-loop inside the
`main` function.

Now I have to define a callback function to apply CSS styles for 
button widget.

```c
# src/main.c

// ...

static void __apply_config(Config *config, void *args){
    MyApp *tmyapp = args;
    gchar *stylesheet = malloc(sizeof(gchar)* 256);
    g_sprintf(
            stylesheet,
            "#helloworldbutton {background: %s; color: %s;}",
            gdk_rgba_to_string(&config->background),
            gdk_rgba_to_string(&config->foreground)
    );
    gtk_css_provider_load_from_data(tmyapp->style_provider, stylesheet, -1);
}

int main(int argc, char **argv) {
  // ...

  config_file_watch(__apply_config, &myapp);

  // ...
}
```

I reloaded the CSS styles by using the `gtk_css_provider_load_from_data`
function inside the callback function and used the assigned id
'helloworldbutton' to map styles to the widget. After I passed the
defined callback and a reference to the `myapp` to `config_file_watch`
function.

But still I am not getting any style at the startup. But once I changed
the configuration file, all styles were reflected. So I have to trigger
the callback manually when initializing the file monitor.

```c
# src/config.c

// ...
void config_file_watch(void (*ptr)(Config *config, void *args), void *args) {
  // ...

  Config *init_config = malloc(sizeof(Config));

  // ...

  config_file_apply_default(init_config);
  config_file_parse(init_config, file);
  ptr(init_config, args);

  // ...
}
```

Finally you can see, all styles are reflected at the startup and all
styles are changing once the configuration file changed.
