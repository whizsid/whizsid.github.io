import { Card, CardActionArea, CardActions, CardContent, Divider, Toolbar, withStyles } from "@material-ui/core";
import * as React from "react";
import {RectShape, RoundShape, TextRow} from "react-placeholder/lib/placeholders";
import { placeholderColor } from "../../theme";

const styler = withStyles(theme => ({
    root: {
        minWidth: 260,
        margin: 20,
        marginBottom: 20,
        minHeight: 437,
        display: "flex",
        flexDirection: "column",
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
    }
}));

export interface RepositoryCardProps {
    classes: {
        root: string;
        grow: string;
        divider: string;
    };
}


class RepositoryCardPlaceholder extends React.Component<RepositoryCardProps> {
    public render() {
        const { classes } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent>
                    <CardActionArea  >
                        <Toolbar variant="dense">
                            <TextRow className="show-loading-animation" style={{width: "80%"}} color={placeholderColor}/>
                            <div className={classes.grow} />
                            <RoundShape className="show-loading-animation" style={{width: 24, height: 24}} color={placeholderColor}/>
                        </Toolbar>
                        <Divider className={classes.divider} />
                        <RectShape className="show-loading-animation" style={{height: 140}} color={placeholderColor} />
                    </CardActionArea>
                </CardContent>
                <div className={classes.grow}/>
                <Divider className={classes.divider} />
                <CardActions disableSpacing >
                    <div className={classes.grow} />
                    <RoundShape className="show-loading-animation" style={{marginLeft: 4,width: 24, height: 24}} color={placeholderColor}/>
                    <TextRow className="show-loading-animation"  style={{marginLeft: 4,marginBottom: 8,width: 24}} color={placeholderColor}/>
                    <RoundShape className="show-loading-animation" style={{marginLeft: 4,width: 24, height: 24}} color={placeholderColor}/>
                    <TextRow className="show-loading-animation"  style={{marginLeft: 4, marginBottom: 8,width: 24}} color={placeholderColor}/>
                </CardActions>
            </Card>
        );
    }
}

export default styler(RepositoryCardPlaceholder);