import {createBrowserHistory} from "history";
import * as React from "react";
import {Route , Router as ReactRouter, Switch} from "react-router-dom";
import BlogPage from "./pages/BlogPage";
import HomePage from "./pages/HomePage";
import NotFoundErrorPage from "./pages/NotFoundErrorPage";
import SearchResultPage from "./pages/SearchResultPage";


const history = createBrowserHistory();

history.listen(_ => {
    window.scrollTo(0, 0);
});

class Router extends React.Component {

    public render(){
        return (
            <ReactRouter history={history}>
                <Switch>
                    <Route path="/" exact={true} component={HomePage} />
                    <Route path="/blog/:id/:name" exact={true} component={BlogPage} />
                    <Route path="/search.html" exact={true} component={SearchResultPage} />
                    <Route path="/error.html" exact={true} component={NotFoundErrorPage} />
                </Switch>
            </ReactRouter>
        );
    }
}

export default Router;
