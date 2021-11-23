import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import { BlogPost } from "../../agents/Github";
import { titleToLink } from "../../utils";
import {FC} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 2),
    },
    image: {
        width: "100%",
        height: "100px !important",
    },
    title: {
        fontSize: "0.85em",
        marginLeft: theme.spacing(2),
    },
    date: {
        fontSize: "0.7em",
        marginLeft: theme.spacing(2),
    },
    chipRound: {
        padding: 8,
        width: 16,
        height: 16,
        borderRadius: "100%",
    },
    chip: {
        marginLeft: theme.spacing(1),
    },
}));

interface IRecommendedCardProps {
    post: BlogPost;
}

const RecommendedCard: FC<IRecommendedCardProps> = ({ post }: IRecommendedCardProps) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container={true}>
                <Grid item={true} xs={12} md={6}>
                    <Link
                        to={
                            "/blog/" +
                            post.id +
                            "/" +
                            titleToLink(post.title) +
                            ".html"
                        }
                    >
                        <img
                            className={classes.image}
                            src={
                                "https://raw.githubusercontent.com/whizsid/whizsid.github.io/src/" +
                                post.imagePath
                            }
                            alt={post.title}
                        />
                    </Link>
                </Grid>
                <Grid item={true} xs={12} md={6}>
                    <Link
                        to={
                            "/blog/" +
                            post.id +
                            "/" +
                            titleToLink(post.title) +
                            ".html"
                        }
                    >
                        <Typography className={classes.title} variant="h6">
                            {post.title}
                        </Typography>
                        <Typography className={classes.date} variant="body1">
                            {post.createdAt.substring(0, 10)}
                        </Typography>
                    </Link>
                    <br />
                    {post.languages.map((lang, i) => (
                        <Chip
                            key={i}
                            style={{ backgroundColor: "#" + lang.color }}
                            variant="outlined"
                            className={classes.chip}
                            size="small"
                            label={lang.name}
                            icon={
                                <div className={classes.chipRound}>
                                    <svg
                                        width="14"
                                        height="14"
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#ffffff"
                                            d={lang.iconPath}
                                        />
                                    </svg>
                                </div>
                            }
                        />
                    ))}
                </Grid>
            </Grid>
        </div>
    );
};

export default RecommendedCard;
