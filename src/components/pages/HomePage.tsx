import { Theme, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import { getPinned, getProject, getPost } from "../../agent";
import {  Post as PostType, Project as ProjectType } from "../../types";
import Layout from "../layout/Layout";
import PaginatedLoader from "./PaginatedLoader";
import Project from "./Project";
import Post from "./Post";

const styler = withStyles((theme: Theme) => ({
	terminal: {
		background: theme.palette.primary.dark,
		border: "solid 1px " + theme.palette.text.primary,
        padding: theme.spacing(0.5),
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 16,
        height: "100%",
        overflowY: "auto"
	},
    container: {
        height: "calc(100vh - 56px)",
        maxHeight: 700
    },
    title: {
        padding: theme.spacing(1)
    },
    divider: {
        background: "unset",
        borderTop: "dashed 1px",
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
    },
    grow: {
        flexGrow: 1
    }
}));

export interface HomePageProps {
	classes: {
        terminal: string;
        title: string;
        container: string;
        divider: string;
        grow: string;
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
        this.props.history.push("/lang/"+langId);
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
                return response;
            } else {
                return null;
            }
        });
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
                                        key={key}
                                    />
                                )}
                            />
                        :null}
					</Grid>
					<Grid className={classes.terminal} item={true} md={4} xs={12}>
                        {posts.length?
                            <PaginatedLoader
                                fetchItem={this.fetchPost}
                                title="ls posts/"
                                perPage={8}
                                itemNames={posts}
                                renderItem={(item: PostType, key:number)=>(
                                    <Post
                                        {...item}
                                        onLanguageClick={this.handleClickLangFab}
                                        key={key}
                                    />
                                )}
                            />
                        :null}
					</Grid>
					<Grid className={classes.terminal} item={true} md={3} xs={12}>
						<Typography variant="subtitle2">$ history</Typography>
					</Grid>
				</Grid>
			</Layout>
		);
	}
}

export default styler( withRouter (HomePage));
