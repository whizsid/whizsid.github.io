import { Grid, withStyles } from "@material-ui/core";
import GitalkComponent from "gitalk-pr/dist/gitalk-component";
import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { BlogPost, Github } from "../agents/Github";
import Content from "../components/BlogPage/Content";
import ContentPlaceholder from "../components/BlogPage/ContentPlaceholder";
import Recommended from "../components/BlogPage/Recommended";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SITE_URL } from "../config";
import "../types/gitalk-pr/dist/react-component.d.ts";
import {Helmet} from "react-helmet";
import {titleToLink} from "../utils";

const styler = withStyles((theme) => ({
    pageWrapper: {},
    contentGrid: {
        background: theme.palette.common.white,
        boxShadow:
            "0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15)",
    },
    container: {
        marginTop: theme.spacing(9),
        marginBottom: theme.spacing(2),
    },
    commentSection: {
        margin: theme.spacing(0, 4),
    },
}));

interface BlogPageProps extends RouteComponentProps<{ id: string }> {
    classes: {
        pageWrapper: string;
        contentGrid: string;
        container: string;
        commentSection: string;
    };
}

interface BlogPageState {
    blogPost?: BlogPost;
    loading: boolean;
}

class BlogPage extends React.Component<BlogPageProps, BlogPageState> {
    constructor(props: BlogPageProps) {
        super(props);
        const postId = this.props.match.params.id;
        this.state = {
            loading: true,
        };

        this.handleSearch = this.handleSearch.bind(this);

        Github.blogPost(parseInt(postId))
            .then((result) => {
                if (result.isOk()) {
                    this.setState({
                        blogPost: result.unwrap(),
                        loading: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                }
            })
            .catch(() => this.setState({ loading: false }));
    }

    protected handleSearch(labels: string[], keyword?: string) {
        const params = new URLSearchParams();
        for (let i = 0; i < labels.length; i++) {
            params.set("label[" + i + "]", labels[i]);
        }
        if (keyword) {
            params.set("query", keyword);
        }
        this.props.history.push("/search.html?" + params.toString());
    }

    public render() {
        const { classes } = this.props;
        const { loading, blogPost } = this.state;

        return (
            <div className={classes.pageWrapper}>
                                {blogPost && (
                    <Helmet>
                        <title>WhizSid | {blogPost.title}</title>
                        <meta
                            property="og:title"
                            content={"WhizSid | " + blogPost.title}
                        />
                        <meta
                            name="description"
                            content={blogPost.description}
                        />
                        <meta
                            name="keywords"
                            content={blogPost.languages
                                .map((lng) => lng.name)
                                .concat(blogPost.tags)
                                .concat([
                                    "blog",
                                    "beginner",
                                    "advanced",
                                    "step by step",
                                ])
                                .join(", ")}
                        />
                        <meta property="og:type" content="article" />
                        <meta property="og:article:published_time" content={blogPost.createdAt} />
                        <meta property="og:article:author:first_name" content="Ramesh" />
                        <meta property="og:article:author:last_name" content="Kithsiri" />
                        <meta property="og:article:author:username" content="whizsid" />
                            <meta property="og:article:author:section" content="Programming" />
                                {blogPost.tags.map((tg,i)=>
                                (<meta property="og:article:tag" key={i} content={tg} />)
                                    )}
                            {blogPost.languages.map((lng,i)=>
                                (<meta property="og:article:tag" key={i} content={lng.name} />)
                                    )}
                        <meta
                            property="og:url"
                            content={
                                SITE_URL +
                                "blog/" +
                                blogPost.id +
                                "/" +
                                titleToLink(blogPost.title) +
                                ".html"
                            }
                        />
                        <meta
                            property="og:image"
                            content={
                                "https://github.com/whizsid/whizsid.github.io/raw/src/" +
                                blogPost.imagePath
                            }
                        />
                    </Helmet>
                )}
                <Header widgets={<SearchBox onSearch={this.handleSearch} />} />
                <Grid
                    className={classes.container}
                    justify="center"
                    container={true}
                >
                    <Grid
                        className={classes.contentGrid}
                        item={true}
                        md={8}
                        xs={12}
                    >
                        {loading && <ContentPlaceholder />}
                        {!loading && blogPost && <Content post={blogPost} />}
                        {!loading && !blogPost && <Redirect to="/error.html" />}
                        {!loading && blogPost && (
                            <div className={classes.commentSection}>
                                <GitalkComponent
                                    options={{
                                        number: parseInt(blogPost.id),
                                        clientID: GITHUB_CLIENT_ID,
                                        clientSecret: GITHUB_CLIENT_SECRET,
                                        repo: "whizsid.github.io",
                                        owner: "whizsid",
                                        admin: ["whizsid"],
                                    }}
                                />
                            </div>
                        )}
                    </Grid>

                    <Grid item={true} md={3} xs={12}>
                        {blogPost && <Recommended post={blogPost} />}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default styler(BlogPage);
