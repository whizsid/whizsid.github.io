import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#404040",
            dark: "#000",
            light: "#ad1c1d",
            contrastText: "#149414"
        },
        text: {
            secondary: "#149414",
            primary: "#21cdea",
            disabled: "#0e6b0e",
            hint: "#9ccc9c"
        }
    }
});

export default theme;
