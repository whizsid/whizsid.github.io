import * as React from "react";
import {withStyles, Typography} from "@material-ui/core";

const styler = withStyles(theme => ({
    header: {
        background: "#98b3bc",
        padding: 8,
        color: theme.palette.common.white,
        textAlign: "center"
    }
}));

interface BlogPostsSectionProps {
    classes: {
        header: string;
    }
}

class BlogPostsSection extends React.Component<BlogPostsSectionProps> {
    public render(){

        const {classes} = this.props;
        return (
            <div>
                <Typography className={classes.header} variant="h5" >Blog Posts</Typography>
            </div>
        );
    }
}

export default styler(BlogPostsSection);