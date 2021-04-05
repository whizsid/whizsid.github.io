import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import Helmet from "react-helmet";
import "react-placeholder/lib/reactPlaceholder.css";
import Router from "./Router";
import theme from "./theme";


export default class App extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Helmet
                    link={[
                        {
                            rel: "stylesheet",
                            href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                        }
                    ]}
                    style={[
                        {
                            textCss: `
								body {
									margin:0,
									padding:0
								}
							`,
                            type: "text/css"
                        }
                    ]}
                />
                <div className="App">
                    <Router />
                </div>
            </MuiThemeProvider>
        );
    }
}
