import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Description from "@material-ui/icons/Description";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Folder from "@material-ui/icons/Folder";
import * as React from "react";

const styler = withStyles((theme) => ({
    root: {
        width: 400,
    },
    list: {
        marginLeft: theme.spacing(4),
    },
}));

interface FileBrowserProps {
    classes: {
        root: string;
        list: string;
    };
    paths: string[];
    onPreview?: (path: string) => void;
}

interface FileBrowserState {
    unfolded: string[];
}

class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {
    constructor(props: FileBrowserProps) {
        super(props);

        this.state = {
            unfolded: [],
        };
    }

    protected handleToggleList(path: string, fold: boolean) {
        const { unfolded } = this.state;

        if (fold) {
            this.setState({
                unfolded: unfolded.filter((p) => !p.startsWith(path)),
            });
        } else {
            this.setState({
                unfolded: [...unfolded, path],
            });
        }
    }

    /**
     * @param pwd The current path location
     * @param path The path to render
     * @param isDir Weather that item is a directory or not
     * @param childrens If this item is a directory, it's childs.
     */
    protected renderItem(
        pwd: string,
        path: string,
        isDir: boolean,
        childrens: string[] = []
    ): JSX.Element {
        const { classes, onPreview } = this.props;
        const { unfolded } = this.state;

        const name = path.substr(pwd.length);
        const unfold = unfolded.includes(path);

        return (
            <React.Fragment key={path}>
                <ListItem
                    button
                    divider
                    dense={true}
                    onClick={() =>
                        isDir
                            ? this.handleToggleList(path, unfold)
                            : onPreview && onPreview(path)
                    }
                >
                    <ListItemIcon>
                        {isDir ? <Folder /> : <Description />}
                    </ListItemIcon>
                    <ListItemText primary={name} />
                    {isDir && (unfold ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {isDir && (
                    <Collapse in={unfold}>
                        <List className={classes.list}>
                            {this.renderList(childrens, pwd.concat(name))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    }

    protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
        const listItems: JSX.Element[] = [];
        let previous: string | undefined;
        const nestedPaths: string[] = [];
        let isPrevDir = false;

        const sortedPaths = paths.sort((a, b) => {
            return (
                b.split("/").length - a.split("/").length || a.localeCompare(b)
            );
        });

        sortedPaths.forEach((path) => {
            const relativePath = path.substr(pwd.length);
            const slices = relativePath.split("/");
            const current = slices[0];

            if (current !== "") {
                if (previous && previous !== current) {
                    listItems.push(
                        this.renderItem(
                            pwd,
                            pwd.concat(previous, isPrevDir ? "/" : ""),
                            isPrevDir,
                            nestedPaths
                        )
                    );
                    nestedPaths.length = 0;
                }
                nestedPaths.push(path);
                previous = current;
                isPrevDir = slices.length > 1;
            }
        });

        if (previous) {
            listItems.push(
                this.renderItem(
                    pwd,
                    pwd.concat(previous, isPrevDir ? "/" : ""),
                    isPrevDir,
                    nestedPaths
                )
            );
        }

        return listItems;
    }

    public render() {
        const { classes, paths } = this.props;
        return (
            <div className={classes.root}>
                <List>{this.renderList(paths)}</List>
            </div>
        );
    }
}

export default styler(FileBrowser);
