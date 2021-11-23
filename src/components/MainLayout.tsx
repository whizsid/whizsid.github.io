import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import Header from "../components/Header";
import { Outlet, Link } from "react-router-dom";
import SearchBox from "./SearchBox";
import ScrollToTop from "./ScrollToTop";

const MainLayout: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [homepage, setHomepage] = useState(false);

    useEffect(() => {
        setHomepage(location.pathname === "/");
    }, [location.pathname]);

    const handleSearch = (labels: string[], keyword: string | null) => {
        const params = new URLSearchParams();
        if (keyword) {
            params.set("query", keyword);
        }
        for (let i = 0; i < labels.length; i++) {
            params.set("label[" + i + "]", labels[i]);
        }
        navigate("/search.html?" + params.toString());
    };
    return (
        <main className="main">
            <ScrollToTop />
            <Header
                homepage={homepage}
                widgets={
                    homepage ? (
                        <Button
                            style={{ marginLeft: 16, borderColor: "#fff" }}
                            variant="outlined"
                            size="small"
                            component={Link}
                            to="/search.html"
                        >
                            Visit Blog
                        </Button>
                    ) : (
                        <SearchBox onSearch={handleSearch} />
                    )
                }
            />
            <Outlet />
        </main>
    );
};

export default MainLayout;
