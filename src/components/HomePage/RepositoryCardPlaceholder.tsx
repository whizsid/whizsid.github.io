import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import {
    RectShape,
    RoundShape,
    TextRow,
} from "react-placeholder/lib/placeholders";
import { FC } from "react";
import { placeholderColor } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minWidth: 260,
        margin: 20,
        marginBottom: 20,
        minHeight: 437,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("md")]: {
            marginLeft: "10vw",
        },
    },
    grow: {
        flexGrow: 1,
    },
    divider: {
        marginTop: 4,
        marginBottom: 4,
    },
}));

const RepositoryCardPlaceholder: FC = () => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <CardActionArea>
                    <Toolbar variant="dense">
                        <TextRow
                            className="show-loading-animation"
                            style={{ width: "80%" }}
                            color={placeholderColor}
                        />
                        <div className={classes.grow} />
                        <RoundShape
                            className="show-loading-animation"
                            style={{ width: 24, height: 24 }}
                            color={placeholderColor}
                        />
                    </Toolbar>
                    <Divider className={classes.divider} />
                    <RectShape
                        className="show-loading-animation"
                        style={{ height: 140 }}
                        color={placeholderColor}
                    />
                </CardActionArea>
            </CardContent>
            <div className={classes.grow} />
            <Divider className={classes.divider} />
            <CardActions disableSpacing>
                <div className={classes.grow} />
                <RoundShape
                    className="show-loading-animation"
                    style={{ marginLeft: 4, width: 24, height: 24 }}
                    color={placeholderColor}
                />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 24 }}
                    color={placeholderColor}
                />
                <RoundShape
                    className="show-loading-animation"
                    style={{ marginLeft: 4, width: 24, height: 24 }}
                    color={placeholderColor}
                />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 24 }}
                    color={placeholderColor}
                />
            </CardActions>
        </Card>
    );
};

export default RepositoryCardPlaceholder;
