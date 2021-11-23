import CloudDownload from "@mui/icons-material/CloudDownload"; 
import Facebook from "@mui/icons-material/Facebook"; 
import Info from "@mui/icons-material/Info"; 
import LinkedIn from "@mui/icons-material/LinkedIn";
import Reddit from "@mui/icons-material/Reddit";
import Twitter from "@mui/icons-material/Twitter";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import {Theme} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import GitalkComponent from "gitalk-pr/dist/gitalk-component";
import { useEffect, useState, Fragment, FC } from "react";
import { Helmet } from "react-helmet";
import { RectShape } from "react-placeholder/lib/placeholders";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import {
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
} from "react-share";
import { BlogPost, Github } from "../agents/Github";
import Content from "../components/BlogPage/Content";
import ContentPlaceholder from "../components/BlogPage/ContentPlaceholder";
import FileBrowser from "../components/BlogPage/FileBrowser";
import Recommended from "../components/BlogPage/Recommended";
import RecommendedCardPlaceholder from "../components/BlogPage/RecommendedCardPlaceholder";
import {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_OWNER,
    GITHUB_REPOSITORY,
    SITE_URL,
} from "../config";
import { placeholderColor } from "../theme";
import "../types/gitalk-pr/dist/react-component.d.ts";
import { titleToLink } from "../utils";

const useStyles = makeStyles((theme: Theme) => ({
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
    recommended: {
        padding: theme.spacing(1),
    },
    socialIcon: {
        marginRight: theme.spacing(1),
    },
    socialButton: {
        display: "flex",
        paddingRight: 40,
        marginTop: theme.spacing(1),
    },
    shareText: {
        flexGrow: 1,
        width: "15.3vw",
        textAlign: "center",
        [theme.breakpoints.down("md")]: {
            width: "65vw",
        },
    },
    shareDiv: {
        textAlign: "center",
    },
    socialButtonPlaceholder: {
        width: "calc(100% - 32px) !important",
        marginRight: "auto !important",
        height: "32px!important",
        margin: "auto",
        marginTop: "8px",
    },
    grow: {
        flexGrow: 1,
    },
    filesToolbar: {
        paddingLeft: 0,
    },
}));

interface IBlogPageParams {
    id: string;
    name: string;
}

const BlogPage: FC = () => {
    const [loading, setLoading] = useState(true);
    const [blogPost, setBlogPost] = useState(null as null | BlogPost);
    const [filePopupAnchorEl, setFilePopupAnchorEl] = useState(
        null as null | HTMLButtonElement
    );
    const { id } = useParams() as IBlogPageParams;
    const classes = useStyles();

    useEffect(() => {
        if (id && id.trim() !== "") {
            setLoading(true);

            Github.blogPost(parseInt(id))
                .then((result) => {
                    if (result.isOk()) {
                        setBlogPost(result.unwrap());
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    const handleClickFileDownload = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setFilePopupAnchorEl(event.currentTarget);
    };

    const handleCloseFileDownload = () => {
        setFilePopupAnchorEl(null);
    };

    return (
        <div className={classes.pageWrapper}>
            {blogPost && (
                <Helmet>
                    <title>WhizSid | {blogPost.title}</title>
                    <meta
                        property="og:title"
                        content={"WhizSid | " + blogPost.title}
                    />
                    <meta name="description" content={blogPost.description} />
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
                    <meta
                        property="og:article:published_time"
                        content={blogPost.createdAt}
                    />
                    <meta
                        property="og:article:author:first_name"
                        content="Ramesh"
                    />
                    <meta
                        property="og:article:author:last_name"
                        content="Kithsiri"
                    />
                    <meta
                        property="og:article:author:username"
                        content="whizsid"
                    />
                    <meta
                        property="og:article:author:section"
                        content="Programming"
                    />
                    {blogPost.tags.map((tg, i) => (
                        <meta property="og:article:tag" key={i} content={tg} />
                    ))}
                    {blogPost.languages.map((lng, i) => (
                        <meta
                            property="og:article:tag"
                            key={i}
                            content={lng.name}
                        />
                    ))}
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
            <Grid
                className={classes.container}
                justifyContent="center"
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
                    {!loading && !blogPost && <Navigate to="/error.html" />}
                    {!loading && blogPost && (
                        <div className={classes.commentSection}>
                            <GitalkComponent
                                options={{
                                    admin: ["whizsid"],
                                    clientID: GITHUB_CLIENT_ID,
                                    clientSecret: GITHUB_CLIENT_SECRET,
                                    number: parseInt(blogPost.id),
                                    owner: "whizsid",
                                    repo: "whizsid.github.io",
                                }}
                            />
                        </div>
                    )}
                </Grid>

                <Grid
                    item={true}
                    className={classes.recommended}
                    md={3}
                    xs={12}
                >
                    <Typography variant="h6">Share</Typography>
                    <Divider />
                    <div className={classes.shareDiv}>
                        {!blogPost &&
                            Array(4)
                                .fill(1)
                                .map((_, i) => (
                                    <RectShape
                                        key={i}
                                        className={clsx(
                                            "show-loading-animation",
                                            classes.socialButtonPlaceholder
                                        )}
                                        color={placeholderColor}
                                    />
                                ))}
                        {blogPost && [
                            <FacebookShareButton
                                key={0}
                                url={
                                    SITE_URL +
                                    "blog/" +
                                    blogPost.id +
                                    "/" +
                                    titleToLink(blogPost.title) +
                                    ".html"
                                }
                                quote={
                                    blogPost
                                        ? blogPost.title
                                        : "WhizSid | Blog & Portfolio"
                                }
                                hashtag="#whizsid"
                            >
                                <Button
                                    component="a"
                                    style={{
                                        backgroundColor: "#1877F2",
                                        color: "#FFFFFF",
                                    }}
                                    className={classes.socialButton}
                                >
                                    <Facebook
                                        className={classes.socialIcon}
                                        color="inherit"
                                    />
                                    <div className={classes.shareText}>
                                        {" "}
                                        Share on Facebook{" "}
                                    </div>
                                </Button>
                            </FacebookShareButton>,
                            <TwitterShareButton
                                key={0}
                                url={
                                    SITE_URL +
                                    "blog/" +
                                    blogPost.id +
                                    "/" +
                                    titleToLink(blogPost.title) +
                                    ".html"
                                }
                                title={
                                    blogPost
                                        ? blogPost.title
                                        : "WhizSid | Blog & Portfolio"
                                }
                                hashtags={["whizsid"]}
                            >
                                <Button
                                    component="a"
                                    style={{
                                        backgroundColor: "#1DA1F2",
                                        color: "#FFFFFF",
                                    }}
                                    className={classes.socialButton}
                                >
                                    <Twitter
                                        className={classes.socialIcon}
                                        color="inherit"
                                    />
                                    <div className={classes.shareText}>
                                        {" "}
                                        Retweet On Twitter{" "}
                                    </div>
                                </Button>
                            </TwitterShareButton>,
                            <LinkedinShareButton
                                key={0}
                                url={
                                    SITE_URL +
                                    "blog/" +
                                    blogPost.id +
                                    "/" +
                                    titleToLink(blogPost.title) +
                                    ".html"
                                }
                                title={
                                    blogPost
                                        ? blogPost.title
                                        : "WhizSid | Blog & Portfolio"
                                }
                            >
                                <Button
                                    component="a"
                                    style={{
                                        backgroundColor: "#0A66C2",
                                        color: "#FFFFFF",
                                    }}
                                    className={classes.socialButton}
                                >
                                    <LinkedIn
                                        className={classes.socialIcon}
                                        color="inherit"
                                    />
                                    <div className={classes.shareText}>
                                        {" "}
                                        Share On LinkedIn{" "}
                                    </div>
                                </Button>
                            </LinkedinShareButton>,
                            <RedditShareButton
                                key={0}
                                url={
                                    SITE_URL +
                                    "blog/" +
                                    blogPost.id +
                                    "/" +
                                    titleToLink(blogPost.title) +
                                    ".html"
                                }
                                title={
                                    blogPost
                                        ? blogPost.title
                                        : "WhizSid | Blog & Portfolio"
                                }
                            >
                                <Button
                                    component="a"
                                    style={{
                                        backgroundColor: "#FF4500",
                                        color: "#FFFFFF",
                                    }}
                                    className={classes.socialButton}
                                >
                                    <Reddit
                                        className={classes.socialIcon}
                                        color="inherit"
                                    />
                                    <div className={classes.shareText}>
                                        {" "}
                                        Share On Reddit{" "}
                                    </div>
                                </Button>
                            </RedditShareButton>,
                        ]}
                    </div>
                    <br />
                    <br />
                    {blogPost && blogPost.example && (
                        <Fragment>
                            <Toolbar
                                className={classes.filesToolbar}
                                variant="dense"
                            >
                                <Typography variant="h6">Files</Typography>
                                <div className={classes.grow} />
                                <IconButton
                                    onClick={handleClickFileDownload}
                                    size="small"
                                    title="Download Files"
                                >
                                    <CloudDownload />
                                </IconButton>
                                <Popover
                                    open={!!filePopupAnchorEl}
                                    anchorEl={filePopupAnchorEl}
                                    onClose={handleCloseFileDownload}
                                    anchorOrigin={{
                                        horizontal: "center",
                                        vertical: "bottom",
                                    }}
                                    transformOrigin={{
                                        horizontal: "center",
                                        vertical: "top",
                                    }}
                                >
                                    <List>
                                        <ListItem
                                            component="a"
                                            href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/releases/download/${blogPost.id}/changed.zip`}
                                            button
                                        >
                                            <ListItemText primary="Changed Files" />
                                        </ListItem>
                                        <ListItem
                                            component="a"
                                            href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/releases/download/${blogPost.id}/all.zip`}
                                            button
                                        >
                                            <ListItemText primary="All Files" />
                                        </ListItem>
                                    </List>
                                </Popover>
                                <Tooltip title="You can view only changed files from below tree view. Please click the left download button if you want all files.">
                                    <IconButton size="small">
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                            <Divider />
                            <FileBrowser {...blogPost.example} />
                            <br />
                            <br />
                        </Fragment>
                    )}
                    <Typography variant="h6">Recommended</Typography>
                    <Divider />
                    {blogPost && <Recommended post={blogPost} />}
                    {!blogPost && [
                        <RecommendedCardPlaceholder key={0} />,
                        <RecommendedCardPlaceholder key={1} />,
                    ]}
                </Grid>
            </Grid>
        </div>
    );
};

export default BlogPage;
