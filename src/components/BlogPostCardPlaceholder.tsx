import { Card, CardActionArea, CardActions, CardContent, Toolbar, withStyles } from "@material-ui/core";
import * as React from "react";
import { RoundShape, TextRow } from "react-placeholder/lib/placeholders";
import { placeholderColor } from "../theme";

const styler = withStyles(theme => ({
    root: {
        minWidth: 360,
        margin: 20,
        marginBottom: 20,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("md")]: {
            marginLeft: theme.spacing(1),
            minWidth: 280,
            minHeight: 160
        }
    },
    grow: {
        flexGrow: 1
    },
    verticalSpace: { 
        height: 60, 
        width: "100%",
        [theme.breakpoints.down("md")]: {
            height: 38
        }
    },
    divider: {
        marginTop: 4,
        marginBottom: 4
    }
   
}));

export interface BlogPostCardProps {
    classes: {
        root: string;
        grow: string;
        divider: string;
        verticalSpace: string;
    };
}


class BlogPostCardPlaceholder extends React.Component<BlogPostCardProps> {
    public render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>

                <CardActionArea  >
                    <CardContent>
                        <Toolbar variant="dense">
                            <RoundShape className="show-loading-animation" style={{ width: 24, height: 24, marginRight: 4 }} color={placeholderColor} />
                            <RoundShape className="show-loading-animation" style={{ width: 24, height: 24, marginRight: 4 }} color={placeholderColor} />
                            <div className={classes.grow} />
                            <TextRow className="show-loading-animation" style={{ width: "80%" }} color={placeholderColor} />
                        </Toolbar>
                        <div className={classes.verticalSpace} />
                    </CardContent>
                    <CardActions disableSpacing >
                        <div className={classes.grow} />
                        <RoundShape className="show-loading-animation" style={{ marginLeft: 4, width: 24, height: 24 }} color={placeholderColor} />
                        <TextRow className="show-loading-animation" style={{ marginLeft: 4, marginBottom: 8, width: 24 }} color={placeholderColor} />
                        <RoundShape className="show-loading-animation" style={{ marginLeft: 4, width: 24, height: 24 }} color={placeholderColor} />
                        <TextRow className="show-loading-animation" style={{ marginLeft: 4, marginBottom: 8, width: 24 }} color={placeholderColor} />
                    </CardActions>

                </CardActionArea>
            </Card>
        );
    }
}

export default styler(BlogPostCardPlaceholder);
