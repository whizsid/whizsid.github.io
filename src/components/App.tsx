import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import theme from "../theme";
import "./App.css";
import Router from "./Router";

class App extends React.Component {
	public render() {

		return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <Router/>
                </div>
            </MuiThemeProvider>
		);
	}
}

export default App;