import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Fab, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { APP_URL } from "../../../config";
import { Project as ProjectType } from "../../../types";

const useStyles = makeStyles((theme: Theme)=>({
    projectCard:{
        background: "unset",
        border: "dashed 2px",
        borderRadius: 0,
        padding: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    projectCardMedia: {
        height: 100
    },
    langFab: {
        fontSize: 10,
        height: "24px !important"
    }
}));

export interface ProjectProps extends ProjectType {
    onLanguageClick: (id: string)=>(e:React.MouseEvent)=>void;
    onCardClick: (e: React.MouseEvent<HTMLElement>)=>void;
}

const Project:React.FunctionComponent<ProjectProps> = (project:ProjectProps)=>{

    const classes = useStyles();

    return (
        <Grid md={5} xs={12} item={true}>
            <Card className={classes.projectCard} >
                <CardActionArea onClick={project.onCardClick} >
                    <CardHeader titleTypographyProps={{variant:"body1"}} title={project.title} />
                    <CardMedia image={APP_URL+project.image} className={classes.projectCardMedia} />
                    <CardContent>
                        <Typography variant="caption">{project.description}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {project.languages.map((lang,langKey)=>(
                        <Fab
                            onClick={project.onLanguageClick(lang)}
                            className={classes.langFab}
                            key={langKey}
                            variant="extended"
                            size="small"
                            title={"Click to see blog posts from "+lang+" language"}
                            color="secondary"
                        >
                            {lang}
                        </Fab>
                    ))}
                </CardActions>
            </Card>
        </Grid>
    );
};

export default Project;