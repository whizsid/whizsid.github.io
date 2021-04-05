import {createBrowserHistory} from "history";
import * as React from "react";
import {Route , Router as ReactRouter, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import SearchResultPage from "./pages/SearchResultPage";
import NotFoundErrorPage from "./pages/NotFoundErrorPage";


const history = createBrowserHistory();

class Router extends React.Component {

    public render(){
        return (
            <ReactRouter history={history}>
                <Switch>
                    <Route path="/" exact={true} component={HomePage} />
                    <Route path="/blog/:id/:name" exact={true} component={BlogPage} />
                    <Route path="/search" exact={true} component={SearchResultPage} />
                    <Route path="/error" exact={true} component={NotFoundErrorPage} />
                </Switch>
            </ReactRouter>
        );
    }
}

export default Router;
