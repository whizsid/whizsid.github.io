import * as React from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { withStyles, fade } from "@material-ui/core";
import clsx from "clsx";
import { SearchResult, Github, BlogPost } from "../../agents/Github";
import { debounce } from "debounce";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { titleToLink } from "../../utils";

interface SearchBoxProps {
    onSearch: (labels: string[], keyword?: string) => void;
    onResponse?: (response: SearchResult) => void;
    classes: {
        inputRoot: string;
        inputInput: string;
        inputForm: string;
        searchIcon: string;
        search: string;
        labels: string;
        label: string;
        plus: string;
        result: string;
        resultFocused: string;
        resultText: string;
        resultHeader: string;
        resultHint: string;
        resultEmpty: string;
    };
}

const styler = withStyles(theme => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "auto",
            minWidth: 300,
            marginLeft: theme.spacing(5),
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: "inherit",
    },
    inputForm: {
        display: "inline-flex"
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
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
    },
    label: {
        height: "1em",
        color: "rgba(256,256,256,0.85)",
        cursor: "pointer",
    },
    plus: {
        padding: theme.spacing(0, 1)
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
        height: 80
    },
    resultText: {
        color: theme.palette.common.black + "!important",
        fontStyle: "none"
    },
    resultHeader: {
        background: theme.palette.common.white,
    },
    resultHint: {
        color: theme.palette.text.secondary,
    }
}));

interface SearchBoxState {
    focused: boolean;
    result?: SearchResult;
    keyword?: string;
    labels: string[];
    loading: boolean;
}

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
    constructor(props: SearchBoxProps) {
        super(props);

        this.state = {
            focused: false,
            labels: [],
            loading: false,
            keyword: ""
        };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fetchData = debounce(this.fetchData, 800);
        this.onSubmit = this.onSubmit.bind(this);
    }

    protected fetchData() {
        const { keyword, labels } = this.state;
        this.setState({
            loading: true
        });

        Github.search(keyword ? keyword : " ", 20, labels ? labels : []).then(data => {
            if (data.isOk()) {
                const response = data.unwrap();
                if (this.props.onResponse) {
                    this.props.onResponse(response);
                }
                this.setState({
                    result: response
                });
            }
            this.setState({
                loading: false
            });
        }).catch(() => this.setState({ loading: false }));
    }

    protected onFocus() {
        this.setState({
            focused: true
        });
    }

    protected onBlur() {
        window.setTimeout(() =>
            this.setState({
                focused: false
            }), 100);
    }

    protected onChange(el: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            keyword: el.target.value
        }, () => this.fetchData());
    }

    public selectLabel(prefix: string, label: string) {
        const { keyword, labels } = this.state;
        const modifiedKeyword = keyword?.replace(new RegExp(label + "(\\s|)"), "");
        const labelName = prefix + ":" + label;

        this.setState({
            keyword: modifiedKeyword,
            labels: [...labels.filter(l => l !== labelName), labelName]
        }, () => this.fetchData());
    }

    public removeLabel(label: string) {
        this.setState({
            labels: this.state.labels.filter(l => l !== label)
        }, () => this.fetchData());
    }

    public onSubmit(e: React.FormEvent){
        e.preventDefault();
        this.props.onSearch(this.state.labels, this.state.keyword);
    }

    public render() {
        const { classes, onSearch } = this.props;
        const { focused, result, keyword, labels, loading } = this.state;

        const isEmpty = (!keyword || keyword === "") && labels.length === 0;
        const isResult = result && (!!result.tags.length || !!result.posts.length || !!result.languages.length);

        let hint: string;

        if (isEmpty) {
            hint = "Please type here to search..";
        } else if (loading) {
            hint = "Be patient.. Fetching your results...";
        } else {
            hint = "Sorry! No results found :-(";
        }

        return <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <div className={classes.labels} >
                {labels.map((label, key) => [
                    <span key={key} onClick={() => this.removeLabel(label)} className={classes.label} >{label.split(`:`)[1]}</span>,
                    key < labels.length - 1 ? <span key={1000 + key} className={classes.plus}>+</span> : undefined
                ])}
            </div>
            <form onSubmit={this.onSubmit} className={classes.inputForm}>
                <InputBase
                    name="keyword"
                    placeholder="Search…"
                    value={keyword}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                />
            </form>
            <div className={clsx(
                classes.result,
                focused ? classes.resultFocused : undefined,
                !isResult ? classes.resultEmpty : undefined,
            )}>
                <List>
                    {!isEmpty && isResult && !loading && (
                        <ListItem onClick={() => onSearch(labels, keyword)} button={true}>
                            <ListItemText primaryTypographyProps={{ className: classes.resultText }} primary={"Show all results"} />
                        </ListItem>
                    )}
                    {(isEmpty || loading || !isResult) && (<ListItem disabled={true}>
                        <ListItemText primaryTypographyProps={{ className: classes.resultHint }} primary={hint} />
                    </ListItem>)}

                    {(result && result.posts.length > 0) && [
                        <ListSubheader key="postsubheader" className={classes.resultHeader}>
                            Posts
                            </ListSubheader>,
                        result.posts.map((post, key) => (
                            <ListItem component={Link} to={"/blog/" + post.id + "/" + titleToLink(post.title) + ".html"} key={key} button>
                                <ListItemText primaryTypographyProps={{ className: classes.resultText }} primary={post.title + " (" + post.createdAt.substring(0, 10) + ")"} />
                            </ListItem>
                        ))

                    ]}

                    {(result && result.languages.length > 0) && [
                        <ListSubheader key="postsubheader" className={classes.resultHeader}>
                            Languages
                            </ListSubheader>,
                        result.languages.map((lang, key) => (
                            <ListItem onClick={() => this.selectLabel("Language", lang.name)} key={key} button>
                                <ListItemText primaryTypographyProps={{ className: classes.resultText }} primary={lang.name} />
                            </ListItem>
                        ))

                    ]}
                    {(result && result.tags.length > 0) && [
                        <ListSubheader key="postsubheader" className={classes.resultHeader}>
                            Tags
                            </ListSubheader>,
                        result.tags.map((tag, key) => (
                            <ListItem onClick={() => this.selectLabel("Tag", tag)} key={key} button>
                                <ListItemText primaryTypographyProps={{ className: classes.resultText }} primary={tag} />
                            </ListItem>
                        ))

                    ]}
                </List>
            </div>
        </div>;
    }

}

export default styler(SearchBox);
