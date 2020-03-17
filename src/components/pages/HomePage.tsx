import { Divider, List, ListItem, ListItemText, Theme, Toolbar, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { getPinned, getProject } from "../../agent";
import { APP_URL } from "../../config";
import { Project } from "../../types";
import Command from "../common/Command";
import Layout from "../layout/Layout";

const styler = withStyles((theme: Theme) => ({
	list: {
		paddingTop: 0
	},
	listItem: {
		padding: 0,
		paddingLeft: theme.spacing(5),
		textDecoration: "underline"
	},
	terminal: {
		background: theme.palette.primary.dark,
		border: "solid 1px " + theme.palette.text.primary,
        padding: theme.spacing(0.5),
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 16,
        height: "100%",
        overflowY: "auto"
	},
	toolbar: {
		paddingLeft: theme.spacing(0.5)
    },
    divider: {
        background: "unset",
        borderTop: "dashed 1px",
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
    },
    imageBox: {
        textAlign: "right",
        paddingRight: theme.spacing(2)
    },
    grow: {
        flexGrow: 1
    },
    buttonText: {
        cursor: "pointer"
    },
    padding: {
        paddingLeft: theme.spacing(4)
    },
    container: {
        height: "calc(100vh - 56px)",
        maxHeight: 700
    }
}));

export interface HomePageProps {
	classes: {
		terminal: string;
		toolbar: string;
		listItem: string;
        list: string;
        divider: string;
        imageBox: string;
        grow: string;
        buttonText: string;
        padding: string;
        container: string;
	};
}

export interface HomePageState {
	loading: boolean;
	projects: string[];
	posts: string[];
	project?: Project;
	showAllProjects: boolean;
    showProject: boolean;
    redirectingToProject: boolean;
    redirectedToProject: boolean;
}

class HomePage extends React.Component<HomePageProps, HomePageState> {
	constructor(props: HomePageProps) {
		super(props);

		this.state = {
			loading: false,
			projects: [],
			posts: [],
			showAllProjects: true,
            showProject: true,
            redirectingToProject: false,
            redirectedToProject: false
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

	protected handleClickAllProjectsToggleButton = () => {
		this.setState({
			showAllProjects: !this.state.showAllProjects
		});
	}

	protected handleClickProjectToggleButton = () => {
		this.setState({
			showProject: !this.state.showProject
		});
    }

    protected handleClickProject = (project: string)=>(e: React.MouseEvent)=>{
        getProject(project).then((response)=>{
            if(response.success){
                this.setState({
                    project: {
                        ...response
                    },
                    showAllProjects: false,
                    redirectingToProject: false,
                    redirectedToProject: false
                });
            } else {
                this.setState({
                    project: undefined
                });
            }
        });
    }

    protected handleClickRedirectToProject = ()=>{
        const {project} = this.state;

        if(project){
            this.setState({
                redirectingToProject: true
            });

            window.setTimeout(()=>{
                window.open(project.repository);
                this.setState({
                    redirectedToProject: true
                });
            },900);
        }
    }

	public render() {
		const { classes } = this.props;
        const {
            posts,
            projects,
            project,
            showAllProjects,
            showProject,
            redirectingToProject,
            redirectedToProject
        } = this.state;

		return (
			<Layout>
				<Grid className={classes.container} justify="space-between" container={true}>
					<Grid alignItems="stretch" className={classes.terminal} item={true} md={4} xs={12}>
                        <Command
                            onToggle={this.handleClickAllProjectsToggleButton}
                            show={showAllProjects}
                            command="ls projects/"
                        />
						{showAllProjects ? (
							<List className={classes.list} dense={true}>
								{projects.map((listProject, key) => (
                                    <ListItem
                                        className={classes.listItem}
                                        key={key}
                                        dense={true}
                                        button={true}
                                        onClick={this.handleClickProject(listProject)}
                                    >
										<ListItemText primary={listProject} />
									</ListItem>
								))}
							</List>
						) : null}
						{project ? (
							<React.Fragment>
                                <Command
                                    command={"nano projects/"+ project.title}
                                    show={showProject}
                                    onToggle={this.handleClickProjectToggleButton}
                                />
                                {showProject?
                                <Grid container={true}>
                                    <Grid className={classes.imageBox} item={true} md={4}>
                                        <img width="80px" src={APP_URL+project.image}/>
                                    </Grid>
                                    <Grid item={true} md={8}>
                                        <Typography variant="body2">{project.title}</Typography>
                                        <Divider className={classes.divider} />
                                        <Typography variant="caption">{project.description}</Typography>
                                        <Divider className={classes.divider} />
                                        <Typography variant="body2">Languages:-</Typography>
                                        <Typography variant="caption">{project.languages.join(", ")}</Typography>
                                        <Divider className={classes.divider} />
                                        <Typography variant="body2">Tags:-</Typography>
                                        <Typography variant="caption">{project.tags.join(", ")}</Typography>
                                        <Divider className={classes.divider} />
                                        <Typography variant="body2">Keywords:-</Typography>
                                        <Typography variant="caption">{project.keywords}</Typography>
                                        <Toolbar variant="dense">
                                            <div className={classes.grow} />
                                            <Typography onClick={this.handleClickRedirectToProject} className={classes.buttonText} variant="button">Read More >></Typography>
                                        </Toolbar>
                                    </Grid>
                                </Grid>
                                :null}
                                {redirectingToProject?
                                    <React.Fragment>
                                        <Command
                                            show={true}
                                            command={"wget "+ project.repository }
                                        />
                                        {redirectedToProject?
                                        <Typography className={classes.padding} variant="body2">301 Redirected.</Typography>
                                        :null}
                                    </React.Fragment>
                                :null}
							</React.Fragment>
                        ) : null}
					</Grid>
					<Grid alignItems="stretch" className={classes.terminal} item={true} md={4} xs={12}>
						<Typography variant="subtitle2">$ ls posts/</Typography>
					</Grid>
					<Grid alignItems="stretch" className={classes.terminal} item={true} md={3} xs={12}>
						<Typography variant="subtitle2">$ history</Typography>
					</Grid>
				</Grid>
			</Layout>
		);
	}
}

export default styler(HomePage);
