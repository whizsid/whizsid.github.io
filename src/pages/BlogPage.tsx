import * as React from "react";
import Header from "../components/Header";
import SearchBox from "../components/Search/SearchBox";
import ContentPlaceholder from "../components/BlogPage/ContentPlaceholder";
import { RouteComponentProps, withRouter, Redirect } from "react-router";
import { BlogPost, Github } from "../agents/Github";
import { withStyles, Grid } from "@material-ui/core";
import Content from "../components/BlogPage/Content";
import Recommended from "../components/BlogPage/Recommended";
import "../types/gitalk-pr/dist/react-component.d.ts";
import GitalkComponent from "gitalk-pr/dist/gitalk-component";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config";

const styler = withStyles((theme) => ({
    pageWrapper: {
    },
    contentGrid: {
        background: theme.palette.common.white,
        boxShadow: "0 1px 2px 0 rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15)",
    },
    container: {
        marginTop: theme.spacing(9),
        marginBottom: theme.spacing(2)
    },
    commentSection: {
        margin: theme.spacing(0, 4)
    },
}));

interface BlogPageProps extends RouteComponentProps<{ id: string }> {
    classes: {
        pageWrapper: string;
        contentGrid: string;
        container: string;
        commentSection: string;
    }
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

        Github.blogPost(parseInt(postId)).then(result => {
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
        }).catch(() => this.setState({ loading: false }));
    }

    protected handleSearch(labels: string[], keyword?: string) {
        const params = new URLSearchParams();
        for (let i = 0; i < labels.length; i++) {
            params.set("label[" + i + "]", labels[i]);
        }
        if (keyword) {
            params.set("query", keyword);
        }
        this.props.history.push("/search?" + params.toString());
    }

    public render() {
        const { classes } = this.props;
        const { loading, blogPost } = this.state;

        return <div className={classes.pageWrapper}>
            <Header widgets={
                <SearchBox onSearch={this.handleSearch} />
            } />
            <Grid className={classes.container} justify="center" container={true}>
                <Grid className={classes.contentGrid} item={true} md={8} xs={12}>
                    {loading && <ContentPlaceholder />}
                    {!loading && blogPost && <Content post={blogPost} />}
                    {!loading && !blogPost && <Redirect to="/error" />}
                    {!loading && blogPost && (<div className={classes.commentSection} ><GitalkComponent options={{
                        number: parseInt(blogPost.id),
                        clientID: GITHUB_CLIENT_ID,
                        clientSecret: GITHUB_CLIENT_SECRET,
                        repo: "whizsid.github.io",
                        owner: "whizsid",
                        admin: ["whizsid"]
                    }} /></div>)}
                </Grid>

                <Grid item={true} md={3} xs={12}>
                    {blogPost && (<Recommended post={blogPost} />)}
                </Grid>
            </Grid>
        </div>
    }

}

export default styler(BlogPage);
