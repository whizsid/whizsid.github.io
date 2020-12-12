import { Card, CardActionArea, CardActions, CardContent, Chip, Divider, Icon, Toolbar, Typography, withStyles } from "@material-ui/core";
import * as React from "react";
import { Repository } from "../../agents/Github";
import forkIcon from "../../images/fork.svg";
import githubIcon from "../../images/social/github-black.svg";
import starIcon from "../../images/star.svg";

const styler = withStyles(theme => ({
    root: {
        maxWidth: 260,
        margin: 20,
        marginBottom: 48,
        minHeight: 290,
        display: "flex",
        flexDirection: "column",
        height: "calc( 100% - 48px )",
        [theme.breakpoints.down("md")]:{
            marginLeft: "10vw"
        }
    },
    grow: {
        flexGrow: 1
    },
    divider: {
        marginTop: 4,
        marginBottom: 4
    },
    githubActionIcon: {
        marginTop:8,
        marginLeft: 16
    },
    topic: {
        margin: 4
    },
    langIcon: {
        padding: 8,
        width: 16,
        height: 16,
        borderRadius: "100%"
    }
}));

export interface RepositoryCardProps extends Repository {
    classes: {
        root: string;
        grow: string;
        divider: string;
        githubActionIcon: string;
        topic: string;
        langIcon: string;
    };
}


class RepositoryCard extends React.Component<RepositoryCardProps> {
    public render() {
        const { name, description, classes, starCount, topics, languages, forkCount, id } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <CardActionArea target="_blank" href={"https://github.com/"+id} >
                        <Toolbar variant="dense">
                            <Typography variant="h6">{name}</Typography>
                            <div className={classes.grow} />
                            <Icon>
                                <img src={githubIcon} alt="Github black icon svg" />
                            </Icon>
                        </Toolbar>
                        <Divider className={classes.divider} />
                        <Typography variant="caption">{description}</Typography>
                        <div>
                            {topics.map((topic,k)=>(
                                <Chip key={k} className={classes.topic} size="small" label={topic} />
                            ))}
                            {languages.map((lang,k)=>(
                                <Chip key={k} style={{backgroundColor: lang.color}} variant="outlined" className={classes.topic} size="small" label={lang.name} icon={
                                    <div className={classes.langIcon}>
                                        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24">
                                            <path fill="#ffffff" d={lang.iconPath}/></svg>
                                    </div>
                                }/>
                            ))}
                        </div>
                    </CardActionArea>
                </CardContent>
                <div className={classes.grow}/>
                <Divider className={classes.divider} />
                <CardActions disableSpacing >
                    <div className={classes.grow} />
                    <Icon className={classes.githubActionIcon}>
                        <img src={starIcon} alt="Github star icon" />
                    </Icon>
                    {starCount}
                    <Icon className={classes.githubActionIcon}>
                        <img src={forkIcon} alt="Github fork icon" />
                    </Icon>
                    {forkCount}
                </CardActions>
            </Card>
        );
    }
}

export default styler(RepositoryCard);