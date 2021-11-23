import { None, Option, Some } from "@hqoss/monads";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import {Theme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useState, useEffect, FC } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { BlogPost, Github } from "../agents/Github";
import BlogPostCard from "../components/BlogPostCard";
import BlogPostCardPlaceholder from "../components/BlogPostCardPlaceholder";
import LabelDrawer from "../components/Search/LabelDrawer";
import { SITE_URL } from "../config";

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        paddingTop: theme.spacing(8),
        flexGrow: 1,
        padding: theme.spacing(1),
        marginLeft: 258,
        [theme.breakpoints.down("lg")]: {
            marginLeft: 50,
        },
    },
}));

const extractValuesFromQuery = (
    params: URLSearchParams
): { labels: string[]; keyword?: string } => {
    const labels = [];
    const keyword = (params.get("query") ? params.get("query") : undefined) as
        | string
        | undefined;
    let i = 0;
    while (params.get("label[" + i + "]")) {
        const label = params.get("label[" + i + "]") as string;
        labels.push(label);
        i++;
    }

    return {
        keyword,
        labels,
    };
};

const SearchResultPage: FC = () => {
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState(None as Option<string>);
    const [posts, setPosts] = useState([] as BlogPost[]);
    const [drawer, setDrawer] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { keyword, labels } = extractValuesFromQuery(searchParams);
    const classes = useStyles();

    useEffect(() => {
        setCursor(None);
        setPosts([]);
        setLoading(true);
        Github.searchPosts(20, labels, keyword ? Some(keyword) : None, cursor)
            .then((result) => {
                setLoading(false);
                if (result.isOk()) {
                    const success = result.unwrap();
                    setPosts(success.posts);
                    setCursor(success.cursor);
                }
            })
            .catch(() => setLoading(false));
    }, [keyword, labels.toString()]);

    const handleDrawerToggle = (open: boolean) => {
        setDrawer(open);
    };

    const labelsTextPart = labels.map((lbl) => lbl.split(":").pop()).join(", ");
    let text = "";
    if (keyword) {
        text += 'for "' + keyword + '"';
    }
    if (labels.length > 0) {
        if (keyword) {
            text += " and ";
        } else {
            text += "for ";
        }
        text += labelsTextPart;
    }
    const textWithPrefix = "Posts " + text;
    let keywords: string[] = ["blog", "beginner", "advanced", "step by step"];
    if (keyword) {
        keywords = keywords.concat(keyword.split(" "));
    }
    if (labels.length > 0) {
        keywords = keywords.concat(
            labels.map((lbl) => lbl.split(":").pop() as string)
        );
    }
    return (
        <div>
            <Helmet>
                <title>WhizSid | {textWithPrefix}</title>
                <meta
                    property="og:title"
                    content="WhizSid | Portfolio & Blog"
                />
                <meta
                    name="description"
                    content={
                        "You are lucky today. There are ten posts found " +
                        text +
                        "."
                    }
                />
                <meta name="keywords" content={keywords.join(", ")} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL + "search.html"} />
                <meta
                    property="og:image"
                    content={SITE_URL + "img/opengraph.png"}
                />
            </Helmet>
            <LabelDrawer open={drawer} onToggle={handleDrawerToggle} />
            <div className={classes.content}>
                <Typography variant="h5">{textWithPrefix}</Typography>
                <Divider />
                <Grid container={true}>
                    {!loading &&
                        posts.length > 0 &&
                        posts.map((post, i) => (
                            <BlogPostCard key={i} {...post} />
                        ))}

                    {loading && [
                        <BlogPostCardPlaceholder key={0} />,
                        <BlogPostCardPlaceholder key={1} />,
                        <BlogPostCardPlaceholder key={2} />,
                    ]}
                </Grid>
            </div>
        </div>
    );
};

export default SearchResultPage;
