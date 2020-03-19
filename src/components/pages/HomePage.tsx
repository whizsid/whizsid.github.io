import { Divider, Theme, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ScrollArea from "react-scrollbar";
import { getPinned, getPost, getProject } from "../../agent";
import {  Post as PostType, Project as ProjectType } from "../../types";
import Layout from "../layout/Layout";
import History from "./HomePage/History";
import PaginatedLoader from "./HomePage/PaginatedLoader";
import Post from "./HomePage/Post";
import Project from "./HomePage/Project";

const styler = withStyles((theme: Theme) => ({
	terminal: {
		background: theme.palette.primary.dark,
		border: "solid 1px " + theme.palette.text.primary,
        padding: theme.spacing(0.5),
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 16,
        height: "100%"
	},
    container: {
        height: "calc(100vh - 56px)",
        maxHeight: 700
    },
    title: {
        padding: theme.spacing(1)
    },
    grow: {
        flexGrow: 1
    },
    scrollArea: {
        height: "100%"
    }
}));

export interface HomePageProps {
	classes: {
        terminal: string;
        title: string;
        container: string;
        grow: string;
        scrollArea: string;
	};
}

export interface HomePageState {
	loading: boolean;
	projects: string[];
    posts: string[];
}


class HomePage extends React.Component<HomePageProps & RouteComponentProps, HomePageState> {
	constructor(props: HomePageProps & RouteComponentProps) {
		super(props);

		this.state = {
			loading: false,
            projects: [],
            posts: [],
		};
	}

	componentDidMount() {
        this.setState({ loading: true });

		getPinned().then((response) => {
			if (response.success) {
				this.setState({
					posts: response.posts,
					projects: response.projects,
					loading: false
                });
			} else {
				this.setState({
					loading: false
				});
			}
		});
    }


    protected handleClickLangFab = (langId: string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/lang/"+langId+".html");
    }

    protected handleClickTagFab = (tagId: string)=>(e: React.MouseEvent)=>{
        this.props.history.push("/tag/"+tagId+".html");
    }

    protected fetchProject = (projectId: string): Promise<ProjectType|null>=>{
        return getProject(projectId).then((response)=>{
            if(response.success){
                return response;
            } else {
                return null;
            }
        });
    }

    protected fetchPost = (postId: string): Promise<PostType|null>=>{
        return getPost(postId).then((response)=>{
            if(response.success){
                return {
                    ...response,
                    id: postId
                };
            } else {
                return null;
            }
        });
    }

    protected handleClickPost = (postId:string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/blog/" + postId + ".html");
    }

    protected handleClickProject = (projectId: string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/project/"+projectId+".html");
    }

	public render() {
		const { classes } = this.props;
        const {
            projects,
            posts
        } = this.state;

		return (
			<Layout>
				<Grid className={classes.container} justify="space-between" container={true}>
					<Grid className={classes.terminal} item={true} md={4} xs={12}>
                        <ScrollArea
                            speed={0.8}
                            horizontal={false}
                            className={classes.scrollArea}
                        >
                        {projects.length?
                            <PaginatedLoader
                                fetchItem={this.fetchProject}
                                title="ls project/"
                                perPage={8}
                                itemNames={projects}
                                renderItem={(item: ProjectType, key:number)=>(
                                    <Project
                                        {...item}
                                        onLanguageClick={this.handleClickLangFab}
                                        onCardClick={this.handleClickProject(item.title)}
                                        key={key}
                                    />
                                )}
                            />
                        :null}
                        </ScrollArea>
					</Grid>
					<Grid className={classes.terminal} item={true} md={4} xs={12}>
                        <ScrollArea
                            speed={0.8}
                            horizontal={false}
                            className={classes.scrollArea}
                        >
                        {posts.length?
                            <PaginatedLoader
                                fetchItem={this.fetchPost}
                                title="ls posts/"
                                perPage={8}
                                itemNames={posts}
                                renderItem={(item: PostType, key:number)=>(
                                    <Post
                                        {...item}
                                        onTagClick={this.handleClickTagFab}
                                        onCardClick={this.handleClickPost(item.id)}
                                        key={key}
                                    />
                                )}
                            />
                        :null}
                        </ScrollArea>
					</Grid>
					<Grid className={classes.terminal} item={true} md={3} xs={12}>
						<Typography className={classes.title} variant="body2">$ history</Typography>
                        <Divider/>
                        <History />
					</Grid>
				</Grid>
			</Layout>
		);
	}
}

export default styler( withRouter (HomePage));
