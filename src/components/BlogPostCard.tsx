import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import SvgIcon from "@mui/material/SvgIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { FC } from "react";
import { useNavigate } from "react-router";
import { BlogPost } from "../agents/Github";
import { GITHUB_OWNER, GITHUB_REPOSITORY } from "../config";
import { titleToLink } from "../utils";

const useStyles = makeStyles((theme: Theme) => ({
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
            height: 160,
        },
        backgroundSize: "cover",
        boxShadow: "2px 0px 4px rgba(0,0,0,0.5)",
    },
    grow: {
        flexGrow: 1,
    },
    divider: {
        marginTop: 4,
        marginBottom: 4,
    },
    language: {
        backgroundColor: "#ffffff",
        borderRadius: "100%",
        marginRight: 4,
    },
    languages: {
        marginRight: 8,
    },
    title: {
        color: "#ffffff",
        textShadow: "2px 2px 4px #000000",
        fontSize: "1rem",
    },
    tag: {
        marginLeft: 4,
        background: "#ebebeb",
    },
    cardActionArea: {
        display: "flex",
        flexGrow: 1,
        alignItems: "start",
    },
    toolbar: {
        alignItems: "start",
    },
}));

const BlogPostCard: FC<BlogPost> = ({
    imagePath,
    languages,
    title,
    tags,
    id,
}: BlogPost) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleClick = (id: string, title: string) => {
        navigate("/blog/" + id + "/" + titleToLink(title) + ".html");
    };
    return (
        <Card
            style={{
                backgroundImage:
                    "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgb(255, 255, 255))," +
                    "url(https://github.com/" +
                    GITHUB_OWNER +
                    "/" +
                    GITHUB_REPOSITORY +
                    "/raw/src/" +
                    imagePath +
                    ")",
            }}
            className={classes.root}
        >
            <CardActionArea
                className={classes.cardActionArea}
                onClick={() => handleClick(id, title)}
            >
                <CardContent>
                    <Toolbar className={classes.toolbar} variant="dense">
                        <div className={classes.languages}>
                            {languages.map((lang, i) => (
                                <SvgIcon key={i} className={classes.language}>
                                    <path fill={lang.color} d={lang.iconPath} />
                                </SvgIcon>
                            ))}
                        </div>
                        <div className={classes.grow} />
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                    </Toolbar>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <div className={classes.grow} />
                {tags.map((tag, i) => (
                    <Chip
                        size="small"
                        key={i}
                        className={classes.tag}
                        label={tag}
                    />
                ))}
            </CardActions>
        </Card>
    );
};

export default BlogPostCard;
