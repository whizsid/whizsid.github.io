#include "config.h"
#include "glib/gprintf.h"
#include <gtk/gtk.h>
#include <gtk/gtkcssprovider.h>

typedef struct {
  GtkCssProvider *style_provider;
} MyApp;
MyApp myapp;

static void print_hello(GtkWidget *widget, gpointer data) {
  g_print("Hello World\n");
}

static void activate(GtkApplication *app, gpointer user_data) {
  GtkWidget *window;
  GtkWidget *button;
  GtkWidget *box;

  window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), "Window");
  gtk_window_set_default_size(GTK_WINDOW(window), 200, 200);

  box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_set_halign(box, GTK_ALIGN_CENTER);
  gtk_widget_set_valign(box, GTK_ALIGN_CENTER);

  gtk_window_set_child(GTK_WINDOW(window), box);

  button = gtk_button_new_with_label("Hello World");

  gtk_widget_set_name(GTK_WIDGET(button), "helloworldbutton");
  gtk_style_context_add_provider(gtk_widget_get_style_context(button),
                                 GTK_STYLE_PROVIDER(myapp.style_provider),
                                 GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);

  g_signal_connect(button, "clicked", G_CALLBACK(print_hello), NULL);
  g_signal_connect_swapped(button, "clicked", G_CALLBACK(gtk_window_destroy),
                           window);

  gtk_box_append(GTK_BOX(box), button);

  gtk_widget_show(window);
}

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
  GtkApplication *app;
  int status;

  app = gtk_application_new("org.gtk.example", G_APPLICATION_FLAGS_NONE);
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);

  myapp.style_provider = gtk_css_provider_new();
  config_file_watch(__apply_config, &myapp);
  status = g_application_run(G_APPLICATION(app), argc, argv);
  g_object_unref(app);

  return status;
}
