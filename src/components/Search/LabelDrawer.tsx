import { None, Some } from "@hqoss/monads";
import {
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar,
    withStyles,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import clsx from "clsx";
import * as React from "react";
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

const isMobile = window.innerWidth<=768;

const styler = withStyles((theme) => ({
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
        paddingTop: theme.spacing(8),
        padding: theme.spacing(2, 1),
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
            display: "none"
        }
    }
}));

interface LabelDrawerProps {
    open?: boolean;
    onToggle?: (toggle: boolean) => void;
    classes: {
        tag: string;
        placeholder: string;
        langIcon: string;
        drawer: string;
        grow: string;
        drawerClosed: string;
        drawerToggle: string;
    };
}

interface LabelDrawerState {
    loadingTags: boolean;
    loadingLanguages: boolean;
    cursorTags?: string;
    cursorLanguages?: string;
    tags: WithCount<Label>[];
    languages: WithCount<Language>[];
}

class LabelDrawer extends React.Component<LabelDrawerProps, LabelDrawerState> {
    constructor(props: LabelDrawerProps) {
        super(props);

        this.state = {
            loadingTags: true,
            loadingLanguages: true,
            tags: [],
            languages: [],
        };

        this.handleClickMoreTags = this.handleClickMoreTags.bind(this);
        this.handleOpenDrawerButtonClick = this.handleOpenDrawerButtonClick.bind(this);
        this.handleCloseDrawerButtonClick = this.handleCloseDrawerButtonClick.bind(this);
        this.handleClickMoreLanguages = this.handleClickMoreLanguages.bind(
            this
        );

        Github.searchLabels(Some("Language:"), None, 10)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const languages = success.labels.map((lbl) => ({
                        count: lbl.pullRequests.totalCount,
                        item: labelToLang(lbl),
                    }));
                    this.setState({
                        loadingLanguages: false,
                        languages,
                        cursorLanguages: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    this.setState({ loadingLanguages: false });
                }
            })
            .catch(() => this.setState({ loadingLanguages: false }));

        Github.searchLabels(Some("Tag:"), None, 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const tags = success.labels.map((tg) => ({
                        count: tg.pullRequests.totalCount,
                        item: tg,
                    }));
                    this.setState({
                        loadingTags: false,
                        tags,
                        cursorTags: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    this.setState({ loadingTags: false });
                }
            })
            .catch(() => this.setState({ loadingTags: false }));
    }

    protected handleClickMoreTags() {
        const { loadingTags, cursorTags, tags } = this.state;

        if (loadingTags || !cursorTags) {
            return true;
        }

        this.setState({
            loadingTags: true,
        });

        Github.searchLabels(Some("Tag:"), Some(cursorTags), 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const newTags = success.labels.map((tg) => ({
                        count: tg.pullRequests.totalCount,
                        item: tg,
                    }));
                    this.setState({
                        loadingTags: false,
                        tags: tags.concat(newTags),
                        cursorTags: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    this.setState({ loadingTags: false });
                }
            })
            .catch(() => this.setState({ loadingTags: false }));
    }

    protected handleClickMoreLanguages() {
        const { loadingLanguages, cursorLanguages, languages } = this.state;

        if (loadingLanguages || !cursorLanguages) {
            return true;
        }

        this.setState({
            loadingLanguages: true,
        });

        Github.searchLabels(Some("Tag:"), Some(cursorLanguages), 20)
            .then((result) => {
                if (result.isOk()) {
                    const success = result.unwrap();
                    const newLanguages = success.labels.map((lbl) => ({
                        count: lbl.pullRequests.totalCount,
                        item: labelToLang(lbl),
                    }));
                    this.setState({
                        loadingLanguages: false,
                        languages: languages.concat(newLanguages),
                        cursorLanguages: success.cursor.isSome()
                            ? success.cursor.unwrap()
                            : undefined,
                    });
                } else {
                    this.setState({ loadingLanguages: false });
                }
            })
            .catch(() => this.setState({ loadingLanguages: false }));
    }

    protected handleOpenDrawerButtonClick(){
        if(this.props.onToggle){
            this.props.onToggle(true);
        }
    }

    protected handleCloseDrawerButtonClick(){
        if(this.props.onToggle){
            this.props.onToggle(false);
        }
    }

    render() {
        const { classes , open} = this.props;
        const {
            loadingTags,
            loadingLanguages,
            tags,
            languages,
            cursorTags,
            cursorLanguages,
        } = this.state;

        if(!open&&isMobile){
            return (
                     <Drawer
                PaperProps={{ className: classes.drawerClosed }}
                open={true}
                variant="persistent"
            >
                <Toolbar variant="dense">
                        <IconButton onClick={this.handleOpenDrawerButtonClick} size="small" >
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
                        <IconButton onClick={this.handleCloseDrawerButtonClick} size="small" >
                            <ChevronLeft />
                            </IconButton>
                </Toolbar>
                <Divider />
                    </div>
                <List>
                    <ListSubheader disableGutters={true}>Tags</ListSubheader>
                    {loadingTags &&
                        tags.length === 0 && [
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
                    {(!loadingTags || tags.length > 0) &&
                        tags.map((tag, i) => (
                            <Link
                                key={i}
                                to={"/search.html?label[0]=" + tag.item.name}
                            >
                                <ListItem
                                    divider={true}
                                    key={i}
                                    dense={true}
                                    button
                                >
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
                    {tags.length > 0 && cursorTags && (
                        <ListItem
                            onClick={this.handleClickMoreTags}
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
                    <ListSubheader disableGutters={true}>
                        Languages
                    </ListSubheader>
                    {loadingLanguages && [
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
                    {!loadingLanguages &&
                        languages.map((lang, i) => (
                            <Link
                                key={i}
                                to={
                                    "/search.html?label[0]=Language%3A" +
                                    lang.item.name
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
                                        primary={lang.item.name
                                            .split(":")
                                            .pop()}
                                    />
                                    <ListItemIcon>
                                        <Chip size="small" label={lang.count} />
                                    </ListItemIcon>
                                </ListItem>
                            </Link>
                        ))}
                    {languages.length > 0 && cursorLanguages && (
                        <ListItem
                            onClick={this.handleClickMoreLanguages}
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
            </Drawer>
        );
    }
}

export default styler(LabelDrawer);
