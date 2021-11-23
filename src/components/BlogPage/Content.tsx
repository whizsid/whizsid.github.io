import Chip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Divider from "@mui/material/Divider";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Markdown from "react-markdown";
import { TextBlock } from "react-placeholder/lib/placeholders";
import { Link, Navigate } from "react-router-dom";
import { BlogPost } from "../../agents/Github";
import { Http } from "../../agents/Http";
import { placeholderColor } from "../../theme";
import CodeBlock from "./CodeBlock";

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        fontSize: "26pt",
        textAlign: "center",
        marginTop: theme.spacing(2),
    },
    titleWrapper: {
        padding: theme.spacing(3),
        paddingBottom: theme.spacing(1),
    },
    grow: {
        flexGrow: 1,
    },
    image: {
        display: "table-row",
        margin: "auto",
        maxWidth: 400,
        maxHeight: 260,
        marginTop: theme.spacing(2),
        [theme.breakpoints.down("lg")]: {
            maxWidth: 280,
            maxHeight: 160,
        },
    },
    description: {
        margin: "auto !important",
        width: "400px !important",
        marginTop: theme.spacing(2) + "px !important",
    },
    paragraph: {
        padding: theme.spacing(2, 3),
        fontFamily: "nunito,sans-serif",
        color: "#333",
        lineHeight: "1.75",
        fontWeight: 400,
        wordWrap: "break-word",
        fontSize: "1rem"
    },
    label: {
        margin: 4,
        cursor: "pointer",
        "&:hover": {
            boxShadow:
                "0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15)",
            filter: "brightness(60%)",
        },
    },
    langIcon: {
        padding: 8,
        width: 16,
        height: 16,
        borderRadius: "100%",
    },
    figure: {
        maxWidth: 400,
        margin: "auto",
        display: "table",
        textAlign: "center",
    },
    figcaption: {
        display: "table-row",
        textAlign: "justify",
        fontStyle: "italic",
        [theme.breakpoints.down("md")]: {
            padding: theme.spacing(0, 2),
            display: "block",
        },
    },
    link: {
        "&:visited, &:active": {
            color: "#017698!important",
            cursor: "pointer",
        },
    },
    inlineCode: {
        background: "#2d2d2d",
        color: "#adadad",
        padding: "3px",
        borderRadius: "2px",
    },
}));

interface IContentProps {
    post: BlogPost;
}

const Content: FC<IContentProps> = ({ post }: IContentProps) => {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null as string | null);
    const classes = useStyles();

    useEffect(() => {
        Http.getContent(
            "https://raw.githubusercontent.com/whizsid/whizsid.github.io/src/" +
                post.postPath
        )
            .then((result) => {
                if (result.isOk()) {
                    let content = result.unwrap();
                    if (content.charAt(0) === "#") {
                        const firstLineEnd = content.search("\n");
                        content = content.substring(firstLineEnd).trimStart();
                    }
                    setContent(content);
                }
                setLoading(false);
            })
            .catch((_e) => setLoading(false));
    }, []);

    return (
        <div>
            <div className={classes.titleWrapper}>
            <Typography className={classes.title} variant="h1">
                {post.title}
            </Typography>
        </div>
            <Toolbar>
                {post.languages.map((lang, i) => (
                    <Link
                        key={i}
                        to={
                            "/search.html?label[0]=Language%3A" +
                            encodeURIComponent(lang.name)
                        }
                    >
                        <Chip
                            style={{ backgroundColor: "#" + lang.color }}
                            variant="outlined"
                            className={classes.label}
                            size="small"
                            label={lang.name}
                            icon={
                                <div className={classes.langIcon}>
                                    <svg
                                        width="14"
                                        height="14"
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#ffffff"
                                            d={lang.iconPath}
                                        />
                                    </svg>
                                </div>
                            }
                        />
                    </Link>
                ))}
                <div className={classes.grow} />
                <Typography variant="body1">
                    {new Date(post.createdAt).toLocaleString()}
                </Typography>
            </Toolbar>
            <Divider />
            <figure className={classes.figure}>
                <img
                    src={
                        "https://github.com/whizsid/whizsid.github.io/raw/src/" +
                        post.imagePath
                    }
                    className={classes.image}
                />
                <figcaption className={classes.figcaption}>
                    {ReactHtmlParser(post.description)}
                </figcaption>
            </figure>
            {!loading && content && (
                <div className={classes.paragraph}>
                    <Markdown
                        components={{
                            code: ({ node, ...props }) => {
                                if (props.inline) {
                                    return (
                                        <code
                                            className={classes.inlineCode}
                                            {...props}
                                        />
                                    );
                                }

                                const className = props.className;
                                let language = undefined;
                                if (
                                    className &&
                                    className.startsWith("language-")
                                ) {
                                    language = className.substring(9);
                                }
                                return (
                                    <CodeBlock
                                        value={props.children[0] as string}
                                        language={language}
                                        {...props}
                                    />
                                );
                            },
                            a: ({ node, ...props }) => (
                                <a {...props} className={classes.link}>
                                    {props.children}
                                </a>
                            ),
                        }}
                    >
                        {content}
                    </Markdown>
                </div>
            )}
            {loading && (
                <TextBlock
                    rows={8}
                    className={clsx(
                        "show-loading-animation",
                        classes.paragraph
                    )}
                    color={placeholderColor}
                />
            )}
            {!loading && !content && <Navigate to="/error.html" />}
            <Divider />
            <Toolbar>
                <div className={classes.grow} />
                {post.tags.map((tag, i) => (
                    <Link
                        key={i}
                        to={
                            "/search.html?label[0]=Tag%3A" +
                            encodeURIComponent(tag)
                        }
                    >
                        <Chip
                            className={classes.label}
                            size="small"
                            label={tag}
                        />
                    </Link>
                ))}
            </Toolbar>
        </div>
    );
};

export default Content;
