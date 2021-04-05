import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { RectShape, RoundShape, TextRow, TextBlock } from "react-placeholder/lib/placeholders";
import { placeholderColor } from "../../theme";
import { withStyles, Toolbar, Typography, Chip } from "@material-ui/core";
import clsx from "clsx";
import ReactHtmlParser from 'react-html-parser';
import { BlogPost } from "../../agents/Github";
import { Http } from "../../agents/Http";
import Markdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import {Link, Redirect} from "react-router-dom";

const styler = withStyles(theme => ({
    title: {
        fontSize: "26pt",
        textAlign: "center",
        marginTop: theme.spacing(2)
    },
    grow: {
        flexGrow: 1
    },
    image: {
        display: "table-row",
        margin: "auto",
        maxWidth: 400,
        maxHeight: 260,
        marginTop: theme.spacing(2)
    },
    description: {
        margin: "auto !important",
        width: "400px !important",
        marginTop: theme.spacing(2) + "px !important"
    },
    paragraph: {
        padding: theme.spacing(2, 3),
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
    },
    label: {
        margin: 4,
        cursor: "pointer",
        "&:hover": {
            boxShadow: "0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15)",
            filter: "brightness(60%)",
        }
    },
    langIcon: {
        padding: 8,
        width: 16,
        height: 16,
        borderRadius: "100%"
    },
    figure: {
        maxWidth: 400,
        margin: "auto",
        display: "table"
    },
    figcaption: {
        display: "table-row",
        textAlign: "justify",
        fontStyle: "italic",
    }
}));

interface ContentProps {
    post: BlogPost;
    classes: {
        title: string;
        grow: string;
        image: string;
        paragraph: string;
        description: string;
        label: string;
        langIcon: string;
        figure: string;
        figcaption: string;
    }
}

interface ContentState {
    loading: boolean;
    content?: string;
}

class Content extends React.Component<ContentProps, ContentState> {
    constructor(props: ContentProps) {
        super(props);

        this.state = {
            loading: true,
        };

        Http.getContent("https://raw.githubusercontent.com/whizsid/whizsid.github.io/src/"+ props.post.postPath).then(result=>{
            if(result.isOk()){
                let content = result.unwrap();
                if(content.charAt(0)=="#"){
                    const firstLineEnd = content.search("\n");
                   content = content.substring( firstLineEnd).trimStart(); 
                }
                this.setState({
                    loading: false,
                    content
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        }).catch(e=>this.setState({loading: false}));
    }

    public render() {
        const { classes, post } = this.props;
        const {loading, content} = this.state;
        return (
            <div>
                <Typography className={classes.title} variant="h1">{post.title}</Typography>
                <Toolbar>
                    {post.languages.map((lang, i) => (
                        <Chip key={i} style={{ backgroundColor: "#" + lang.color }} variant="outlined" className={classes.label} size="small" label={lang.name} icon={
                            <div className={classes.langIcon}>
                                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d={lang.iconPath} /></svg>
                            </div>
                        } />
                    ))}
                    <div className={classes.grow} />
                    <Typography variant="body1">{new Date(post.createdAt).toLocaleString()}</Typography>
                </Toolbar>
                <Divider />
                <figure className={classes.figure} >
                    <img src={"https://github.com/whizsid/whizsid.github.io/raw/src/" + post.imagePath} className={classes.image} />
                    <figcaption className={classes.figcaption} >{ReactHtmlParser(post.description)}</figcaption>
                </figure>
                {!loading&&content&&(<div className={classes.paragraph}><Markdown
                                    source={content}
                                    renderers={{
                                        code: CodeBlock
                                    }}
                                    /></div>)}
                {loading&&(<TextBlock rows={8} className={clsx("show-loading-animation", classes.paragraph)} color={placeholderColor} />)}
                {!loading&&!content&&(<Redirect to="/error" />)}
                <Divider />
                <Toolbar>
                    <div className={classes.grow} />
                    {
                        post.tags.map((tag, i) => (
                            <Chip key={i} className={classes.label} size="small" label={tag} />
                        ))
                    }
                </Toolbar>
            </div>
        );
    }
}

export default styler(Content);
