import SearchIcon from "@mui/icons-material/Search";
import { alpha, Theme } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Github, SearchResult } from "../agents/Github";
import { titleToLink } from "../utils";

interface ISearchBoxProps {
    onSearch: (labels: string[], keyword: string | null) => void;
    onResponse?: (response: SearchResult) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        width: "auto",
        minWidth: 300,
        marginLeft: theme.spacing(5),
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputForm: {
        display: "inline-flex",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `1em`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "40ch",
            },
        },
    },
    labels: {
        display: "inline-flex",
        paddingLeft: theme.spacing(6),
        borderRightStyle: "solid",
        borderRightWidth: 1,
        borderRightColor: "rgba(256,256,256,0.5)",
        padding: theme.spacing(0, 1),
        fontSize: "0.8em",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    label: {
        height: "1em",
        color: "rgba(256,256,256,0.85)",
        cursor: "pointer",
    },
    plus: {
        padding: theme.spacing(0, 1),
    },
    result: {
        position: "absolute",
        width: "100%",
        display: "none",
    },
    resultFocused: {
        background: theme.palette.common.white,
        boxShadow: "0 4px 6px rgba(32,33,36,.28)",
        display: "flex",
        flexDirection: "column",
        listStyleType: "none",
        margin: 0,
        padding: 0,
        border: 0,
        borderRadius: "0 0 24px 24px",
        paddingBottom: "4px",
        overflowX: "auto",
        width: "100%",
        height: 300,
    },
    resultEmpty: {
        height: 80,
    },
    resultText: {
        color: theme.palette.common.black + "!important",
        fontStyle: "none",
    },
    resultHeader: {
        background: theme.palette.common.white,
    },
    resultHint: {
        color: theme.palette.text.secondary,
    },
    labelLink: {
        flex: "1 1 auto",
    },
    labelButtons: {
        flexGrow: 0,
    },
}));

const SearchBox: FC<ISearchBoxProps> = ({
    onSearch,
    onResponse,
}: ISearchBoxProps) => {
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [labels, setLabels] = useState([] as string[]);
    const [keyword, setKeyword] = useState(null as string | null);
    const [result, setResult] = useState(null as SearchResult | null);
    const classes = useStyles();

    const fetchData = (newKeyword?: string, newLabels?: string[]) => {
        setLoading(true);

        Github.search(
            newKeyword || keyword || "",
            20,
            newLabels || labels || []
        )
            .then((data) => {
                setLoading(false);
                if (data.isOk()) {
                    const response = data.unwrap();
                    onResponse && onResponse(response);
                    setResult(response);
                }
            })
            .catch(() => setLoading(false));
    };

    const fetchDataDebounced = useDebouncedCallback(fetchData, 800);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        window.setTimeout(() => setFocused(false), 600);
    };

    const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        setKeyword(el.target.value);
        fetchDataDebounced(el.target.value);
    };

    const handleSelectLabel = (prefix: string, label: string) => {
        const modifiedKeyword = keyword?.replace(
            new RegExp(label + "(\\s|)", "i"),
            ""
        );
        const labelName = prefix + ":" + label;

        const newLabels = [...labels.filter((l) => l !== labelName), labelName];

        setKeyword(modifiedKeyword || null);
        setLabels(newLabels);
        fetchData(modifiedKeyword, newLabels);
    };

    const handleRemoveLabel = (label: string) => {
        const newLabels = labels.filter((l) => l !== label);
        setLabels(newLabels);
        fetchData(undefined, newLabels);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(labels, keyword);
    };

    const isEmpty = (!keyword || keyword === "") && labels.length === 0;
    const isResult =
        result &&
        (!!result.tags.length ||
            !!result.posts.length ||
            !!result.languages.length);

    let hint: string;

    if (isEmpty) {
        hint = "Please type here to search..";
    } else if (loading) {
        hint = "Be patient.. Fetching your results...";
    } else {
        hint = "Sorry! No results found :-(";
    }

    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <div className={classes.labels}>
                {labels.map((label, key) => [
                    <span
                        key={key}
                        onClick={() => handleRemoveLabel(label)}
                        className={classes.label}
                    >
                        {label.split(`:`)[1]}
                    </span>,
                    key < labels.length - 1 ? (
                        <span key={1000 + key} className={classes.plus}>
                            +
                        </span>
                    ) : undefined,
                ])}
            </div>
            <form onSubmit={handleSubmit} className={classes.inputForm}>
                <InputBase
                    name="keyword"
                    placeholder="Search…"
                    value={keyword || ""}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                />
            </form>
            <div
                className={clsx(
                    classes.result,
                    focused ? classes.resultFocused : undefined,
                    !isResult ? classes.resultEmpty : undefined
                )}
            >
                <List>
                    {!isEmpty && isResult && !loading && (
                        <ListItem
                            onClick={() => onSearch(labels, keyword)}
                            button={true}
                        >
                            <ListItemText
                                primaryTypographyProps={{
                                    className: classes.resultText,
                                }}
                                primary={"Show all results"}
                            />
                        </ListItem>
                    )}
                    {(isEmpty || loading || !isResult) && (
                        <ListItem disabled={true}>
                            <ListItemText
                                primaryTypographyProps={{
                                    className: classes.resultHint,
                                }}
                                primary={hint}
                            />
                        </ListItem>
                    )}

                    {result &&
                        result.posts.length > 0 && [
                            <ListSubheader
                                key="postsubheader"
                                className={classes.resultHeader}
                            >
                                Posts
                            </ListSubheader>,
                            result.posts.map((post, key) => (
                                <ListItem
                                    component={Link}
                                    to={
                                        "/blog/" +
                                        post.id +
                                        "/" +
                                        titleToLink(post.title) +
                                        ".html"
                                    }
                                    key={key}
                                    button
                                >
                                    <ListItemText
                                        primaryTypographyProps={{
                                            className: classes.resultText,
                                        }}
                                        primary={
                                            post.title +
                                            " (" +
                                            post.createdAt.substring(0, 10) +
                                            ")"
                                        }
                                    />
                                </ListItem>
                            )),
                        ]}

                    {result &&
                        result.languages.length > 0 && [
                            <ListSubheader
                                key="postsubheader"
                                className={classes.resultHeader}
                            >
                                Languages
                            </ListSubheader>,
                            result.languages.map((lang, key) => (
                                <ListItem
                                    key={key}
                                    button
                                    secondaryAction={
                                        <IconButton
                                            onClick={() =>
                                                handleSelectLabel("Language", lang.name)
                                            }
                                            edge="end"
                                            size="small"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    }
                                >
                                    <Link
                                        to={
                                            "/search.html?label[0]=Language%3A" +
                                            encodeURIComponent(lang.name)
                                        }
                                        className={classes.labelLink}
                                    >
                                        <ListItemText
                                            primaryTypographyProps={{
                                                className: classes.resultText,
                                            }}
                                            primary={lang.name}
                                        />
                                    </Link>
                                </ListItem>
                            )),
                        ]}
                    {result &&
                        result.tags.length > 0 && [
                            <ListSubheader
                                key="postsubheader"
                                className={classes.resultHeader}
                            >
                                Tags
                            </ListSubheader>,
                            result.tags.map((tag, key) => (
                                <ListItem
                                    key={key}
                                    button
                                    secondaryAction={
                                        <IconButton
                                            onClick={() =>
                                                handleSelectLabel("Tag", tag)
                                            }
                                            edge="end"
                                            size="small"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    }
                                >
                                    <Link
                                        to={
                                            "/search.html?label[0]=Tag%3A" +
                                            encodeURIComponent(tag)
                                        }
                                        className={classes.labelLink}
                                    >
                                        <ListItemText
                                            primaryTypographyProps={{
                                                className: classes.resultText,
                                            }}
                                            primary={tag}
                                        />
                                    </Link>
                                </ListItem>
                            )),
                        ]}
                </List>
            </div>
        </div>
    );
};

export default SearchBox;
