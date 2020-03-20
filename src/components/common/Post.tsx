import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Fab, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { APP_URL } from "../../config";
import { Post as PostType } from "../../types";

const useStyles = makeStyles((theme: Theme)=>({
    postCard:{
        background: "unset",
        border: "dashed 2px",
        borderRadius: 0,
        padding: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    postCardMedia: {
        height: 180
    },
    langFab:{
        fontSize: 8,
        height: "12px !important",
        marginLeft: theme.spacing(0.5)
    },
    tagFab: {
        fontSize: 10,
        height: "24px !important"
    },
    grow: {
        flexGrow: 1
    }
}));

export interface PostProps extends PostType {
    onTagClick: (id: string)=>(e:React.MouseEvent)=>void;
    onCardClick: (e: React.MouseEvent<HTMLElement>)=>void;
    md?: boolean | 1 | "auto" | 2 | 7 | 4 | 6 | 5 | 3 | 8 | 10 | 9 | 11 | 12 | undefined;
}

const Post:React.FunctionComponent<PostProps> = (post:PostProps)=>{

    const classes = useStyles();

    return (
        <Grid md={post.md} xs={12} item={true}>
            <Card className={classes.postCard} >
                <CardActionArea onClick={post.onCardClick} >
                    <CardHeader action={
                        <div>
                            {post.languages.map((lang,langKey)=>(
                                <Fab
                                    className={classes.langFab}
                                    key={langKey}
                                    variant="extended"
                                    size="small"
                                    color="secondary"
                                >
                                    {lang}
                                </Fab>
                            ))}
                        </div>
                    } titleTypographyProps={{variant:"body1"}} title={post.title} />
                    <CardMedia image={APP_URL+post.image} className={classes.postCardMedia} />
                    <CardContent>
                        <Typography variant="caption">{post.description}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {post.tags.map((tag,langKey)=>(
                        <Fab
                            onClick={post.onTagClick(tag)}
                            className={classes.tagFab}
                            key={langKey}
                            variant="extended"
                            size="small"
                            title={"Click to see blog posts from "+tag+" tag"}
                            color="secondary"
                        >
                            {tag}
                        </Fab>
                    ))}
                    <div className={classes.grow}/>
                    {post.date}
                </CardActions>
            </Card>
        </Grid>
    );
};

export default Post;