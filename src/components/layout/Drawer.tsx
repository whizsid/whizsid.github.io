import { List, ListItem, ListItemIcon, ListItemText, Theme } from "@material-ui/core";
import MuiDrawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import * as React from "react";
import { Link } from "react-router-dom";
import { getLangs } from "../../agent";
import { Language } from "../../types";

export interface DrawerProps {
    open: boolean;
    classes: {
        drawer: string;
        drawerOpen: string;
        drawerClose: string;
        listItem: string;
        listItemText: string;
    };
    onToggle: (open: boolean) => void;
}

export interface DrawerState {
    langs: Language[];
    loading: boolean;
}

const styler = withStyles((theme: Theme) => ({
    drawer: {
        paddingTop: theme.spacing(7),
        background: theme.palette.primary.main,
        overflowX: "hidden",
        borderRight: "solid 1px " + theme.palette.text.primary
    },
    drawerOpen: {
        width: 160,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        width: 48,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    listItem: {
        background: theme.palette.grey[700],
        paddingLeft: theme.spacing(0.5)
    },
    listItemText: {
        color: theme.palette.text.primary
    }
}));

class Drawer extends React.Component<DrawerProps, DrawerState> {
    constructor(props: DrawerProps) {
        super(props);

        this.state = {
            langs: [],
            loading: false
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        });

        getLangs().then((response) => {
            if (response.success) {
                this.setState({
                    loading: false,
                    langs: response.langs
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    }

    public render() {
        const { open, classes, onToggle } = this.props;
        const { langs } = this.state;

        return (
            <MuiDrawer
                variant="permanent"
                anchor="left"
                open={true}
                PaperProps={{
                    className: clsx(classes.drawer, open ? classes.drawerOpen : classes.drawerClose),
                    onMouseOver: () => onToggle(true),
                    onMouseLeave: () => onToggle(false),
                }}
            >
                <List dense={true}>
                    {langs.map((lang, key) => (
                        <ListItem divider={true} dense={true} className={classes.listItem} key={key}>
                            <Link to={"/lang/" + lang.id+ ".html"} title={lang.description}>
                                <ListItemIcon>
                                    <img width="32px" src={lang.logo} alt={"Transparent SVG logo of " + lang.name} />
                                </ListItemIcon>
                                {open ? <ListItemText className={classes.listItemText} primary={lang.name} /> : null}
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </MuiDrawer>
        );
    }
}

export default styler(Drawer);
