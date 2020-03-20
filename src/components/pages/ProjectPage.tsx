import { Divider, Fab, Grid, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import Markdown from "react-markdown";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {
    FacebookShareButton,
    TwitterShareButton
} from "react-share";
import { getPost, getPostContent, getByLanguage, ByCategoryResponse, ErrorResponse, getByTag, getPinned, PinnedResponse } from "../../agent";
import { Post as PostType } from "../../types";
import Layout from "../layout/Layout";
import { APP_URL } from "../../config";
import Post from "../common/Post";
import History from "../common/History";

const styler = withStyles(theme=>({
    terminal: {
        background: theme.palette.primary.dark,
		border: "solid 1px " + theme.palette.text.primary,
        padding: theme.spacing(2),
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 16,
        marginBottom: theme.spacing(2)
    },
    langFab:{
        fontSize: 8,
        height: "12px !important",
        marginLeft: theme.spacing(0.5)
    },
    tagFab: {
        fontSize: 10,
        height: "24px !important",
        marginLeft: theme.spacing(1)
    },
    grow: {
        flexGrow: 1
    },
    shareButton: {
        marginRight: theme.spacing(1)
    },
    title: {
        padding: theme.spacing(1)
    },
    topToolbar: {
        paddingTop:0,
        paddingBottom: 0,
        minHeight: "unset"
    }
}));

export interface PostPageProps {
    classes: {
        terminal: string;
        langFab: string;
        tagFab: string;
        grow: string;
        shareButton: string;
        title: string;
        topToolbar: string;
    };
    match: {
        params: {
            postId: string;
        };
    };
}

export interface PostPageState {
    post?: PostType;
    content?: string;
    featured: PostType[];
}

class PostPage extends React.Component<PostPageProps & RouteComponentProps, PostPageState> {

    constructor(props:PostPageProps & RouteComponentProps){
        super(props);

        this.state = {
            featured: []
        };

        const {postId} = this.props.match.params;
        const splited = postId.split(".");
        this.loadPost(splited[0]);
    }

    componentDidUpdate(prevProps: PostPageProps& RouteComponentProps){
        const {postId} = this.props.match.params;

        if(postId!== prevProps.match.params.postId){
            this.loadPost(postId);
        }
    }

    protected loadPost(postId: string){
        getPostContent(postId).then((response)=>{
            if(response.success){
                this.setState({
                    content: response.content
                },()=>{
                    getPost(postId).then((postResponse)=>{
                        if(postResponse.success){
                            this.setState({
                                post: {...postResponse, id: postId}
                            },()=>{
                                this.loadFeatured();
                            });
                        }
                    });
                });
            } else {
                this.props.history.push("/");
            }
        });

    }

    protected loadFeatured(){
        const {post} = this.state;
        const {postId} = this.props.match.params;

        if(!post){
            return;
        }

        this.setState({
            featured: [],
        },()=>{

            let getPostsRequest: Promise<ByCategoryResponse|ErrorResponse|PinnedResponse>;

            if(post.languages.length){
                const firstLang = post.languages[0];

                getPostsRequest =  getByLanguage(firstLang);
            } else if(post.tags.length) {
                const firstTag = post.tags[0];

                getPostsRequest = getByTag(firstTag);
            } else {
                getPostsRequest = getPinned();
            }

            getPostsRequest.then((response)=>{
                if(response.success){
                    const posts = response.posts;

                    const currentIndex = posts.findIndex(newPostId=>newPostId === postId);

                    const length = posts.length;

                    let toFetch: string[] = [];


                    if(length>5){
                        if(currentIndex===-1){
                            toFetch = posts.slice(posts.length-5);
                        } else {
                            if(posts.length - currentIndex >4){
                                toFetch = posts.slice(currentIndex+1,currentIndex + 6);
                            } else {
                                toFetch = posts.slice(posts.length-5);
                            }
                        }
                    } else {
                        toFetch = posts;
                    }

                    for(const fetchPostId of toFetch){
                        getPost(fetchPostId).then((postResponse)=>{
                            if(postResponse.success){
                                this.setState({
                                    featured: [...this.state.featured,{...postResponse, id: fetchPostId}]
                                });
                            }
                        });
                    }
                }
            });

        });

    }


    protected handleClickLangFab = (langId: string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/lang/"+langId+".html");
    }

    protected handleClickTagFab = (tagId: string)=>(e: React.MouseEvent)=>{
        this.props.history.push("/tag/"+tagId+".html");
    }

    protected handleClickPost = (postId:string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/blog/" + postId + ".html");
    }

    public render(){

        const {classes} = this.props;
        const {postId} = this.props.match.params;
        const {content, post, featured} = this.state;

        if(!content||!post){
            return null;
        }

        return (
            <Layout>
                <Grid justify="space-around" container={true}>
                    <Grid item={true} md={8}>
                        <div  className={classes.terminal}>
                            <Typography variant="body2">$ nano ./posts/{postId.split(".")[0]}.md</Typography>
                            <Divider/>
                            <Toolbar className={classes.topToolbar} variant="dense">
                                {post.languages.length?
                                    <Typography variant="body2">Languages:-</Typography>
                                :null}
                                {post.languages.map((lang, key)=>(
                                    <Fab
                                        size="small"
                                        variant="extended"
                                        color="secondary"
                                        key={key}
                                        className={classes.langFab}
                                        onClick={this.handleClickLangFab(lang)}
                                    >
                                        {lang}
                                    </Fab>
                                ))}
                                <div className={classes.grow} />
                                <Typography variant="body2">@ {post.date}</Typography>
                            </Toolbar>
                            <Divider />
                            <Markdown
                                source={content}
                            />
                            <Divider/>
                            <Toolbar variant="dense">
                                <Typography variant="body2">Tags:-</Typography>
                                {post.tags.map((tag, key)=>(
                                    <Fab
                                        size="small"
                                        variant="extended"
                                        color="secondary"
                                        key={key}
                                        className={classes.tagFab}
                                        onClick={this.handleClickTagFab(tag)}
                                    >
                                        {tag}
                                    </Fab>
                                ))}
                                <div className={classes.grow} />
                                <FacebookShareButton className={classes.shareButton} url={APP_URL+"blog/"+postId+".html"} >
                                    <img src="/img/social/facebook.svg" height="24" width="24"/>
                                </FacebookShareButton>
                                <TwitterShareButton className={classes.shareButton} url={APP_URL+"blog/"+postId+".html"} >
                                    <img src="/img/social/twitter.svg" height="24" width="24"/>
                                </TwitterShareButton>
                            </Toolbar>

                        </div>
                        <div className={classes.terminal}>
                            <Typography variant="body2">$ locate featured</Typography>
                            <Divider />
                            <Grid container={true}>
                                {featured.map(featuredPost=>(
                                    <Post
                                        {...featuredPost}
                                        onCardClick={this.handleClickPost(featuredPost.id)}
                                        onTagClick={this.handleClickTagFab}
                                        md={4}
                                    />
                                ))}
                            </Grid>
                        </div>
                    </Grid>
                    <Grid className={classes.terminal} item={true} md={3}>
                        <Typography variant="body2">$ history</Typography>
                        <Divider />
                        <History />
                    </Grid>
                </Grid>
            </Layout>
        );
    }
}

export default styler (withRouter(PostPage));