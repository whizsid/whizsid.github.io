import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#040404",
            dark: "#000",
            light: "#ad1c1d",
            contrastText: "#149414"
        },
        text: {
            primary: "#149414",
            secondary: "#21cdea",
            disabled: "#0e6b0e",
            hint: "#9ccc9c"
        }
    }
});

export default theme;
