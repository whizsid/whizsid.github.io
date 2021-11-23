import { useLocation } from "react-router";
import { useEffect, Fragment, FC } from "react";

const ScrollToTop: FC = () => {
    const location = useLocation();

    useEffect(()=>{
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return <Fragment />
}

export default ScrollToTop;
