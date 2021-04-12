import { None, Option, Some } from "@hqoss/monads";
import { Divider, Grid, Typography, withStyles } from "@material-ui/core";
import * as React from "react";
import {Helmet} from "react-helmet";
import { RouteComponentProps } from "react-router-dom";
import { BlogPost, Github } from "../agents/Github";
import BlogPostCard from "../components/BlogPostCard";
import BlogPostCardPlaceholder from "../components/BlogPostCardPlaceholder";
import Header from "../components/Header";
import LabelDrawer from "../components/Search/LabelDrawer";
import SearchBox from "../components/SearchBox";
import {SITE_URL} from "../config";

const styler = withStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(8),
        flexGrow: 1,
        padding: theme.spacing(1),
        marginLeft: 258,
        [theme.breakpoints.down("md")]: {
            marginLeft: 50
        }
    },
}));

interface SearchResultPageProps extends RouteComponentProps {
    classes: {
        content: string;
    };
}

interface SearchResultPageState {
    loading: boolean;
    cursor: Option<string>;
    posts: BlogPost[];
    labels: string[];
    keyword?: string;
    drawer: boolean;
}

class SearchResultPage extends React.Component<SearchResultPageProps, SearchResultPageState> {

    constructor(props: SearchResultPageProps){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
         const search = this.props.location.search;
        const params = this.extractValuesFromQuery(search);

        this.state = {
            loading: true,
            cursor: None,
            posts: [],
            drawer: false,
            ...params
        };

        this.search(params.labels, params.keyword);
    }

    componentDidUpdate(prevProps: SearchResultPageProps){
        const currentSearch = this.props.location.search;
        const prevSearch = prevProps.location.search;

        if(prevSearch!==currentSearch){

            const params = this.extractValuesFromQuery(currentSearch);
            this.setState({
                posts: [],
                loading: true,
                cursor: None,
                drawer: false,
                ...params
            },()=>this.search(params.labels, params.keyword));
        }
    }

    protected extractValuesFromQuery(query: string): {labels: string[], keyword?: string} {
        const labels = [];
        const params = new URLSearchParams(query);
        const keyword = (params.get("query")? params.get("query"): undefined) as string|undefined;
        let i = 0;
        while(params.get("label["+i+"]")){
            const label = params.get("label["+i+"]") as string;
            labels.push(label);
            i++;
        }

        return {
            keyword,
            labels
        };
    }

    protected handleSearch(labels: string[], keyword?: string) {
        const params = new URLSearchParams();
        if(keyword){
        params.set("query", keyword);
        }
        for(let i = 0; i<labels.length; i++){
            params.set("label["+i+"]", labels[i]);
        }
        this.props.history.push("/search.html?"+params.toString());
    }

    protected search(labels: string[], keyword?: string) {
        const {cursor, posts} = this.state;
        Github.searchPosts(20, labels, keyword?Some(keyword):None, cursor).then(result=>{
            if(result.isOk()){
                const success = result.unwrap();
                this.setState({
                    loading: false,
                    posts: posts.concat(success.posts),
                    cursor: success.cursor
                });
            } else {
                this.setState({loading: false});
            }
        }).catch(()=>this.setState({loading: false}));
    }

    protected handleDrawerToggle(open:boolean) {
        this.setState({
            drawer: open
        });
    }

    public render() {
        const { classes } = this.props;
        const {loading, posts, labels, keyword, drawer} = this.state;
        const labelsTextPart = labels.map(lbl=>lbl.split(":").pop()).join(", ");
        let text = "";
        if(keyword){
            text += "for \""+ keyword + "\"";
        }
        if(labels.length>0){
            if(keyword){
                text += " and ";
            } else {
                text += "for ";
            }
            text += labelsTextPart;
        }
        const textWithPrefix = "Posts "+text;
        let keywords: string[] = ["blog", "beginner", "advanced", "step by step"];
        if(keyword){
            keywords = keywords.concat( keyword.split(" "));
        }
        if(labels.length>0){
            keywords = keywords.concat(labels.map(lbl=>lbl.split(":").pop() as string));
        }
        return (
            <div>
                <Helmet>
                    <title>WhizSid | {textWithPrefix}</title>
                    <meta property="og:title" content="WhizSid | Portfolio & Blog" />
            <meta name="description" content={"You are lucky today. There are ten posts found "+text+"."}/>
                <meta name="keywords" content={
                    keywords.join(", ")
                } />
<meta property="og:type" content="website" />
<meta property="og:url" content={SITE_URL+"search.html"} />
    <meta property="og:image" content={SITE_URL + "img/opengraph.png"} />
                </Helmet>
                <Header widgets={<SearchBox onSearch={this.handleSearch} />} />
                    <LabelDrawer open={drawer} onToggle={this.handleDrawerToggle}/>
                    <main className={classes.content}>
                            <Typography variant="h5">{textWithPrefix}</Typography>
                                <Divider/>
                                    <Grid container={true}>

                                                {!loading&&posts.length>0&&posts.map((post,i)=>(
                        <BlogPostCard key={i} {...post} />
                                                ))}

                                    {loading&&(
                                        [
                                        <BlogPostCardPlaceholder key={0} />,
                                            <BlogPostCardPlaceholder key={1} />,
                                            <BlogPostCardPlaceholder key={2} />
                                    ]
                                                )}
                                                </Grid>
                        </main>
            </div>
        );
    }
}

export default styler(SearchResultPage);
