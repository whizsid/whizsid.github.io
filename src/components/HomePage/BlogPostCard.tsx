import { Card, CardActionArea, CardActions, CardContent, Divider, Toolbar, withStyles, Icon, SvgIcon, Typography, Chip } from "@material-ui/core";
import * as React from "react";
import { BlogPost } from "../../agents/Github";
import { GITHUB_REPOSITORY, GITHUB_OWNER } from "../../config";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { titleToLink } from "../../utils";


const styler = withStyles(theme => ({
    root: {
        width: 540,
        margin: 20,
        marginBottom: 20,
        height: 280,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("md")]: {
            marginLeft: "10vw"
        },
        backgroundSize: "cover",
        boxShadow: "2px 2px 4px rgba(0,0,0,0.5)"
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
    title: {
        color: "#ffffff",
        textShadow: "2px 2px 4px #000000"
    },
    tag: {
        marginLeft: 4
    }
}));

export interface BlogPostCardProps extends BlogPost {
    classes: {
        root: string;
        grow: string;
        divider: string;
        language: string;
        title: string;
        tag: string;
    };
}


class BlogPostCard extends React.Component<BlogPostCardProps & RouteComponentProps> {
    public render() {
        const { classes, imagePath, languages, title, tags, id } = this.props;
        return (
            <Card style={{ backgroundImage: "url(https://github.com/" + GITHUB_OWNER + "/" + GITHUB_REPOSITORY + "/raw/src/" + imagePath + ")" }} className={classes.root}>

                <CardActionArea onClick={() => this.handleClick(id, title)} >
                    <CardContent>
                        <Toolbar variant="dense">
                            {languages.map((lang, i) => (
                                <SvgIcon key={i} className={classes.language} >
                                    <path fill={lang.color} d={lang.iconPath} />
                                </SvgIcon>
                            ))}
                            <div className={classes.grow} />
                            <Typography variant="h6" className={classes.title} >{title}</Typography>
                        </Toolbar>
                        <div style={{ height: 140, width: "100%" }} />
                    </CardContent>
                    <CardActions disableSpacing >
                        <div className={classes.grow} />
                        {tags.map((tag, i) => (
                            <Chip key={i} className={classes.tag} label={tag} />
                        ))}
                    </CardActions>

                </CardActionArea>
            </Card>
        );
    }

    protected handleClick(id: string, title: string) {
        this.props.history.push("/blog/" + id + "/" + titleToLink(title) + ".html");
    }
}

export default withRouter(styler(BlogPostCard));
