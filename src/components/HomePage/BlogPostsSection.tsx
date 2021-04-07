import { None } from "@hqoss/monads";
import { Grid, Typography, withStyles } from "@material-ui/core";
import * as React from "react";
import { BlogPost, Github } from "../../agents/Github";
import BlogPostCard from "../BlogPostCard";
import BlogPostCardPlaceholder from "../BlogPostCardPlaceholder";

const styler = withStyles(theme => ({
    header: {
        background: "#98b3bc",
        padding: 8,
        color: theme.palette.common.white,
        textAlign: "center"
    }
}));

interface BlogPostsSectionState {
    loading: boolean;
    posts: BlogPost[];
}

interface BlogPostsSectionProps {
    classes: {
        header: string;
    };
}

class BlogPostsSection extends React.Component<BlogPostsSectionProps, BlogPostsSectionState> {
    constructor(props: BlogPostsSectionProps) {
        super(props);

        this.state = {
            loading: true,
            posts: []
        };

        Github.blogPosts(None, [], 5).then(postsResult => {
            if (postsResult.isOk()) {
                const posts = postsResult.unwrap().posts;
                this.setState({ posts, loading: false });
            }
        });
    }

    public renderCards(): JSX.Element[] {
        const { loading, posts } = this.state;

        if (loading) {
            return Array.from({ length: 2 }).fill(<Grid item={true}>
                <BlogPostCardPlaceholder />
            </Grid>
            ) as JSX.Element[];
        } else {
            return posts.map(post => (
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
                <Typography className={classes.header} variant="h5" >Blog Posts</Typography>
                <Grid container={true}>
                    {this.renderCards()}
                </Grid>
            </div>
        );
    }
}

export default styler(BlogPostsSection);
