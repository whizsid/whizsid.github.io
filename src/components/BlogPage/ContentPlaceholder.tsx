import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import {
    RectShape,
    RoundShape,
    TextBlock,
    TextRow,
} from "react-placeholder/lib/placeholders";
import { placeholderColor } from "../../theme";
import {FC} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        margin: "auto !important",
        width: "80% !important",
        height: "3ch !important",
        marginTop: theme.spacing(4) + "px !important",
    },
    grow: {
        flexGrow: 1,
    },
    image: {
        margin: "auto !important",
        width: "400px !important",
        height: "260px !important",
        marginTop: theme.spacing(2) + "px !important",
    },
    description: {
        margin: "auto !important",
        width: "400px !important",
        marginTop: theme.spacing(2) + "px !important",
    },
    paragraph: {
        margin: theme.spacing(3, 3) + "!important",
        width: "90% !important",
    },
}));

const ContentPlaceholder: FC = () => {
    const classes = useStyles();
    return (
        <div>
            <TextRow
                className={clsx("show-loading-animation", classes.title)}
                color={placeholderColor}
            />
            <Toolbar>
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
                <div className={classes.grow} />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 60 }}
                    color={placeholderColor}
                />
            </Toolbar>
            <Divider />
            <RectShape
                className={clsx("show-loading-animation", classes.image)}
                color={placeholderColor}
            />
            <TextBlock
                rows={3}
                className={clsx("show-loading-animation", classes.description)}
                color={placeholderColor}
            />
            <TextBlock
                rows={8}
                className={clsx("show-loading-animation", classes.paragraph)}
                color={placeholderColor}
            />
            <Divider />
            <Toolbar>
                <div className={classes.grow} />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 24 }}
                    color={placeholderColor}
                />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 32 }}
                    color={placeholderColor}
                />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 48 }}
                    color={placeholderColor}
                />
                <TextRow
                    className="show-loading-animation"
                    style={{ marginLeft: 4, marginBottom: 8, width: 28 }}
                    color={placeholderColor}
                />
            </Toolbar>
        </div>
    );
};

export default ContentPlaceholder;
