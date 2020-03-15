import {createBrowserHistory} from "history";
import * as React from "react";
import {Route , Router as ReactRouter, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";

const history = createBrowserHistory();

class Router extends React.Component {

    public render(){
        return (
            <ReactRouter history={history}>
                <Switch>
                    <Route path="/" exact={true} component={HomePage} />
                </Switch>
            </ReactRouter>
        );
    }
}

export default Router;