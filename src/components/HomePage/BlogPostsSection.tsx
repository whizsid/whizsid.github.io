import { None } from "@hqoss/monads";
import { Grid, Typography, withStyles, Button } from "@material-ui/core";
import * as React from "react";
import { BlogPost, Github } from "../../agents/Github";
import BlogPostCard from "../BlogPostCard";
import BlogPostCardPlaceholder from "../BlogPostCardPlaceholder";
import {Link} from "react-router-dom";

const styler = withStyles((theme) => ({
    header: {
        background: "#98b3bc",
        padding: 8,
        color: theme.palette.common.white,
        display: "flex"
    },
    grow: {
        flexGrow: 1
    },
    blogLink: {
        color: theme.palette.common.white
    }
}));

interface BlogPostsSectionState {
    loading: boolean;
    posts: BlogPost[];
}

interface BlogPostsSectionProps {
    classes: {
        header: string;
        grow: string;
        blogLink: string;
    };
}

class BlogPostsSection extends React.Component<
    BlogPostsSectionProps,
    BlogPostsSectionState
> {
    constructor(props: BlogPostsSectionProps) {
        super(props);

        this.state = {
            loading: true,
            posts: [],
        };

        Github.blogPosts(None, [], 5).then((postsResult) => {
            if (postsResult.isOk()) {
                const posts = postsResult.unwrap().posts;
                this.setState({ posts, loading: false });
            }
        });
    }

    public renderCards(): JSX.Element[] {
        const { loading, posts } = this.state;

        if (loading) {
            return Array.from({ length: 3 }).fill(
                <Grid item={true}>
                    <BlogPostCardPlaceholder />
                </Grid>
            ) as JSX.Element[];
        } else {
            return posts.map((post) => (
                <Grid item={true}>
                    <BlogPostCard {...post} />
                </Grid>
            ));
        }
    }

    public render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.header}>
                    <Typography variant="h6">Blog Posts</Typography>
                        <div className={classes.grow} />
                            <Button variant="outlined" size="small" component={Link} to="/search.html" className={classes.blogLink} >Visit Blog</Button>
                </div>
                <Grid justify="center" container={true}>{this.renderCards()}</Grid>
            </div>
        );
    }
}

export default styler(BlogPostsSection);
