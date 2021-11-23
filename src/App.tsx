import {
    StyledEngineProvider,
    ThemeProvider,
} from "@mui/material/styles";
import "react-placeholder/lib/reactPlaceholder.css";
import { useRoutes } from "react-router-dom";
import theme from "./theme";
import routes from "./routes";
import {Helmet} from "react-helmet";
import {FC} from "react";

const App: FC = () => {
    const routing = useRoutes(routes);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Helmet
                    link={[
                        {
                            rel: "stylesheet",
                            href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
                        },
                    ]}
                />
                {routing}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
