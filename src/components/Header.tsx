import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import githubIcon from "../images/social/github.svg";
import twitterIcon from "../images/social/twitter.svg";

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
        flexGrow: 1,
    },
    brandName: {
        color: theme.palette.common.white,
    },
    transparent: {
        backgroundColor: "transparent",
        boxShadow: "none",
    },
}));

interface IHeaderProps {
    widgets?: React.ReactNode;
    homepage?: boolean;
}

const Header: FC<IHeaderProps> = ({ widgets, homepage }: IHeaderProps) => {
    const [inBreadcrumb, setInBreadcrumb] = useState(true);
    const classes = useStyles();

    const handleScroll = () => {
        setInBreadcrumb(!(window.scrollY > 180));
    }

    useEffect(() => {
        if (homepage) {
            window.addEventListener("scroll", handleScroll);
        } else {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [homepage]);

    return (
        <AppBar
            className={clsx(
                classes.appBar,
                inBreadcrumb && homepage ? classes.transparent : undefined
            )}
            variant="elevation"
            position="fixed"
        >
            <Toolbar variant="dense">
                {(!inBreadcrumb || !homepage) && (
                    <Button
                        component={Link}
                        className={classes.brandName}
                        to="/"
                    >
                        WhizSid
                    </Button>
                )}
                {widgets}
                <div className={classes.grow} />
                <IconButton title="twitter" href="#" size="large">
                    <img
                        alt={"Transparent SVG twitter icon by simpleicons.org"}
                        width="32px"
                        src={twitterIcon}
                    />
                </IconButton>
                <IconButton title="github" href="#" size="large">
                    <img
                        alt={"Transparent SVG github icon by simpleicons.org"}
                        width="32px"
                        src={githubIcon}
                    />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
