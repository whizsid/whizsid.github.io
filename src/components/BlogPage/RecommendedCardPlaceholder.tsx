import * as React from "react";
import { withStyles, Grid } from "@material-ui/core";
import { RectShape, RoundShape, TextRow } from "react-placeholder/lib/placeholders";
import clsx from "clsx";
import { placeholderColor } from "../../theme";


const styler = withStyles(theme => ({
    root: {
        padding: theme.spacing(2, 2)
    },
    image: {
        width: "100%",
        height: "100px !important"
    },
    title: {
        width: "100%",
        marginLeft: theme.spacing(2)
    },
    date: {
        width: "8ch !important",
        marginLeft: theme.spacing(2)
    },
    chipRound: {
        display: "inline-flex", width: "24px !important", height: "24px !important",
        marginLeft: theme.spacing(2)
    },
    chip: {
        width: "48px !important", display: "inline-flex", marginLeft: theme.spacing(1)
    }
}));

interface RecommendedCardProps {
    classes: {
        root: string;
        image: string;
        title: string;
        date: string;
        chipRound: string;
        chip: string;
    }
}

class RecommendedCardPlaceholder extends React.Component<RecommendedCardProps> {
    public render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} >
                <Grid container={true}>
                    <Grid item={true} xs={12} md={6}>
                        <RectShape color={placeholderColor} className={clsx("show-loading-animation", classes.image)} />
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                        <TextRow color={placeholderColor} className={clsx("show-loading-animation", classes.title)} />
                        <TextRow color={placeholderColor} className={clsx("show-loading-animation", classes.date)} />
                        <br />
                        <RoundShape className={clsx("show-loading-animation", classes.chipRound)} color={placeholderColor} />
                        <TextRow color={placeholderColor} className={clsx("show-loading-animation", classes.chip)} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default styler(RecommendedCardPlaceholder);
