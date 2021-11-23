import { None } from "@hqoss/monads";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPost, Github } from "../../agents/Github";
import BlogPostCard from "../BlogPostCard";
import BlogPostCardPlaceholder from "../BlogPostCardPlaceholder";

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        background: "#98b3bc",
        padding: 8,
        color: theme.palette.common.white,
        display: "flex",
    },
    grow: {
        flexGrow: 1,
    },
    blogLink: {
        color: theme.palette.common.white,
    },
}));

const BlogPostsSection: FC = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([] as BlogPost[]);

    useEffect(() => {
        Github.blogPosts(None, [], 6).then((postsResult) => {
            setLoading(false);
            if (postsResult.isOk()) {
                const posts = postsResult.unwrap().posts;
                setPosts(posts);
            }
        });
    }, []);

    const renderCards = (): JSX.Element[] => {
        if (loading) {
            return [0,1,2,3,4,5,6].map((i)=>(
                <Grid key={i} item={true}>
                    <BlogPostCardPlaceholder />
                </Grid>
            ));
        } else {
            return posts.map((post, i) => (
                <Grid item={true} key={i}>
                    <BlogPostCard {...post} />
                </Grid>
            ));
        }
    };

    return (
        <div>
            <div className={classes.header}>
                <Typography variant="h6">Blog Posts</Typography>
                <div className={classes.grow} />
                <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/search.html"
                    className={classes.blogLink}
                >
                    Visit Blog
                </Button>
            </div>
            <Grid justifyContent="center" container={true}>
                {renderCards()}
            </Grid>
        </div>
    );
};

export default BlogPostsSection;
