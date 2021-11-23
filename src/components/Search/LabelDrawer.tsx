import { None, Some } from "@hqoss/monads";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useState, useEffect, FC } from "react";
import clsx from "clsx";
import { TextRow } from "react-placeholder/lib/placeholders";
import { Link } from "react-router-dom";
import {
    Github,
    Label,
    labelToLang,
    Language,
    WithCount,
} from "../../agents/Github";
import { placeholderColor } from "../../theme";

const isMobile = window.innerWidth <= 768;

const useStyles = makeStyles((theme: Theme) => ({
    tag: {
        color: theme.palette.common.black + "!important",
        fontStyle: "none",
    },
    placeholder: {
        height: "28px !important",
        marginTop: 2,
    },
    langIcon: {
        "& .MuiChip-label": {
            paddingLeft: 0,
            paddingRight: 6,
        },
    },
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerClosed: {
        paddingTop: theme.spacing(8),
        padding: theme.spacing(1, 1),
        paddingLeft: 0,
        width: 40,
        flexShrink: 0,
    },
    grow: {
        flexGrow: 1,
    },
    drawerToggle: {
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    firstHeader: {
        marginTop: theme.spacing(8),
    },
}));

interface ILabelDrawerProps {
    open?: boolean;
    onToggle?: (toggle: boolean) => void;
}

interface Item<T> {
    loading: boolean;
    cursor?: string;
    items: WithCount<T>[];
}

const LabelDrawer: FC<ILabelDrawerProps> = ({
    onToggle,
    open,
}: ILabelDrawerProps) => {
    const classes = useStyles();

    const [tags, setTags] = useState({
        loading: true,
        items: [],
    } as Item<Label>);
    const [languages, setLanguages] = useState({
        loading: true,
        items: [],
    } as Item<Language>);

    useEffect(() => {
        Github.searchLabels(Some("Language:"), None, 10)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const languages = success.labels.map((lbl) => ({
                        count: lbl.pullRequests.totalCount,
                        item: labelToLang(lbl),
                    }));
                    setLanguages({
                        loading: false,
                        items: languages,
                        cursor: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    setLanguages({ ...languages, loading: false });
                }
            })
            .catch(() => setLanguages({ ...languages, loading: false }));

        Github.searchLabels(Some("Tag:"), None, 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const tags = success.labels.map((tg) => ({
                        count: tg.pullRequests.totalCount,
                        item: tg,
                    }));
                    setTags({
                        loading: false,
                        items: tags,
                        cursor: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    setTags({ ...tags, loading: false });
                }
            })
            .catch(() => setTags({ ...tags, loading: false }));
    }, []);

    const handleClickMoreTags = () => {
        if (tags.loading || !tags.cursor) {
            return true;
        }

        setTags({
            ...tags,
            loading: true,
        });

        Github.searchLabels(Some("Tag:"), Some(tags.cursor), 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const newTags = success.labels.map((tg) => ({
                        count: tg.pullRequests.totalCount,
                        item: tg,
                    }));
                    setTags({
                        loading: false,
                        items: tags.items.concat(newTags),
                        cursor: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    setTags({ ...tags, loading: false });
                }
            })
            .catch(() => setTags({ ...tags, loading: false }));
    };

    const handleClickMoreLanguages = () => {
        if (languages.loading || !languages.cursor) {
            return true;
        }

        setLanguages({ ...languages, loading: true });

        Github.searchLabels(Some("Language:"), Some(languages.cursor), 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const newLanguages = success.labels.map((lbl) => ({
                        count: lbl.pullRequests.totalCount,
                        item: labelToLang(lbl),
                    }));
                    setLanguages({
                        loading: false,
                        items: languages.items.concat(newLanguages),
                        cursor: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    setLanguages({ ...languages, loading: false });
                }
            })
            .catch(() => setLanguages({ ...languages, loading: false }));
    };

    const handleOpenDrawerButtonClick = () => {
        onToggle && onToggle(true);
    };

    const handleCloseDrawerButtonClick = () => {
        onToggle && onToggle(false);
    };

    if (!open && isMobile) {
        return (
            <Drawer
                PaperProps={{ className: classes.drawerClosed }}
                open={true}
                variant="persistent"
            >
                <Toolbar variant="dense">
                    <IconButton
                        onClick={handleOpenDrawerButtonClick}
                        size="small"
                    >
                        <ChevronRight />
                    </IconButton>
                </Toolbar>
            </Drawer>
        );
    }

    return (
        <Drawer
            PaperProps={{ className: classes.drawer }}
            open={true}
            variant="persistent"
        >
            <div className={classes.drawerToggle}>
                <Toolbar variant="dense">
                    <div className={classes.grow} />
                    <IconButton
                        onClick={handleCloseDrawerButtonClick}
                        size="small"
                    >
                        <ChevronLeft />
                    </IconButton>
                </Toolbar>
                <Divider />
            </div>
            <List>
                <ListSubheader
                    className={classes.firstHeader}
                    disableGutters={true}
                >
                    Languages
                </ListSubheader>
                {languages.loading && [
                    <TextRow
                        key={0}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                    <TextRow
                        key={1}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                    <TextRow
                        key={2}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                ]}
                {!languages.loading &&
                    languages.items.map((lang, i) => (
                        <Link
                            key={i}
                            to={
                                "/search.html?label[0]=Language%3A" +
                                encodeURIComponent(lang.item.name)
                            }
                        >
                            <ListItem divider={true} dense={true} button>
                                <ListItemIcon>
                                    <svg
                                        width="14"
                                        height="14"
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#000000"
                                            d={lang.item.iconPath}
                                        />
                                    </svg>
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{
                                        className: classes.tag,
                                    }}
                                    primary={lang.item.name.split(":").pop()}
                                />
                                <ListItemIcon>
                                    <Chip size="small" label={lang.count} />
                                </ListItemIcon>
                            </ListItem>
                        </Link>
                    ))}
                {languages.items.length > 0 && languages.cursor && (
                    <ListItem
                        onClick={handleClickMoreLanguages}
                        dense={true}
                        button
                    >
                        <ListItemText
                            primaryTypographyProps={{
                                className: classes.tag,
                            }}
                            primary="Load More.."
                        />
                    </ListItem>
                )}
            </List>
            <ListSubheader disableGutters={true}>Tags</ListSubheader>
            {tags.loading &&
                tags.items.length === 0 && [
                    <TextRow
                        key={0}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                    <TextRow
                        key={1}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                    <TextRow
                        key={2}
                        className={clsx(
                            "show-loading-animation",
                            classes.placeholder
                        )}
                        color={placeholderColor}
                    />,
                ]}
            {(!tags.loading || tags.items.length > 0) &&
                tags.items.map((tag, i) => (
                    <Link key={i} to={"/search.html?label[0]=" + tag.item.name}>
                        <ListItem divider={true} key={i} dense={true} button>
                            <ListItemText
                                primaryTypographyProps={{
                                    className: classes.tag,
                                }}
                                primary={tag.item.name.split(":").pop()}
                            />
                            <ListItemIcon>
                                <Chip size="small" label={tag.count} />
                            </ListItemIcon>
                        </ListItem>
                    </Link>
                ))}
            {tags.items.length > 0 && tags.cursor && (
                <ListItem onClick={handleClickMoreTags} dense={true} button>
                    <ListItemText
                        primaryTypographyProps={{
                            className: classes.tag,
                        }}
                        primary="Load More.."
                    />
                </ListItem>
            )}
        </Drawer>
    );
};

export default LabelDrawer;
