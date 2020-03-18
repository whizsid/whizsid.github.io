import * as React from "react";
import { Post as PostType } from "../../types";
import { Grid, CardHeader, Card, CardMedia, CardContent, Typography, CardActions, Fab, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { APP_URL } from "../../config";

const useStyles = makeStyles((theme: Theme)=>({
    postCard:{
        background: "unset",
        border: "dashed 2px",
        borderRadius: 0,
        padding: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    postCardMedia: {
        height: 100
    },
    langFab: {
        fontSize: 10,
        height: "24px !important"
    }
}));

export interface PostProps extends PostType {
    onLanguageClick: (id: string)=>(e:React.MouseEvent)=>void;
}

const Post:React.FunctionComponent<PostProps> = (post:PostProps)=>{

    const classes = useStyles();

    return (
        <Grid md={12} xs={12} item={true}>
            <Card className={classes.postCard} >
                <CardHeader titleTypographyProps={{variant:"body1"}} title={post.title} />
                <CardMedia image={APP_URL+post.image} className={classes.postCardMedia} />
                <CardContent>
                    <Typography variant="caption">{post.description}</Typography>
                </CardContent>
                <CardActions>
                    {post.languages.map((lang,langKey)=>(
                        <Fab
                            onClick={post.onLanguageClick(lang)}
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

export default Post;