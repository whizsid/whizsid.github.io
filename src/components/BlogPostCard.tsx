import { Card, CardActionArea, CardActions, CardContent, Chip, SvgIcon, Toolbar, Typography, withStyles } from "@material-ui/core";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { BlogPost } from "../agents/Github";
import { GITHUB_OWNER, GITHUB_REPOSITORY } from "../config";
import { titleToLink } from "../utils";


const styler = withStyles(theme => ({
    root: {
        width: 360,
        margin: 20,
        marginBottom: 20,
        height: 200,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("md")]: {
            marginLeft: theme.spacing(1),
            width: 280,
            height: 160
        },
        backgroundSize: "cover",
        boxShadow: "2px 0px 4px rgba(0,0,0,0.5)"
    },
    grow: {
        flexGrow: 1
    },
    divider: {
        marginTop: 4,
        marginBottom: 4
    },
    language: {
        backgroundColor: "#ffffff", borderRadius: "100%", marginRight: 4
    },
    languages: {
        marginRight: 8
    },
    title: {
        color: "#ffffff",
        textShadow: "2px 2px 4px #000000",
        fontSize: "1rem"
    },
    tag: {
        marginLeft: 4
    },
    cardActionArea: {
        display: "flex",
        flexGrow: 1,
        alignItems: "start"
    },
    toolbar: {
        alignItems: "start"
    }
}));

export interface BlogPostCardProps extends BlogPost {
    classes: {
        root: string;
        grow: string;
        divider: string;
        language: string;
        languages: string;
        title: string;
        tag: string;
        cardActionArea: string;
        toolbar: string;
    };
}

class BlogPostCard extends React.Component<BlogPostCardProps & RouteComponentProps> {
    public render() {
        const { classes, imagePath, languages, title, tags, id } = this.props;
        return (
            <Card style={{
                backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgb(255, 255, 255)),"+
                "url(https://github.com/" + GITHUB_OWNER + "/" + GITHUB_REPOSITORY + "/raw/src/" + imagePath + ")"
            }} className={classes.root}>

                <CardActionArea className={classes.cardActionArea} onClick={() => this.handleClick(id, title)} >
                    <CardContent>
                        <Toolbar className={classes.toolbar} variant="dense">
                            <div className={classes.languages}>
                            {languages.map((lang, i) => (
                                <SvgIcon key={i} className={classes.language} >
                                    <path fill={lang.color} d={lang.iconPath} />
                                </SvgIcon>
                                    ))}
                                    </div>
                            <div className={classes.grow} />
                            <Typography variant="h6" className={classes.title} >{title}</Typography>
                        </Toolbar>
                    </CardContent>
                </CardActionArea>
                    <CardActions>
                        <div className={classes.grow} />
                        {tags.map((tag, i) => (
                            <Chip size="small" key={i} className={classes.tag} label={tag} />
                        ))}
                    </CardActions>

            </Card>
        );
    }

    protected handleClick(id: string, title: string) {
        this.props.history.push("/blog/" + id + "/" + titleToLink(title) + ".html");
    }
}

export default withRouter(styler(BlogPostCard));
