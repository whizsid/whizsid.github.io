import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Paper,
    withStyles,
} from "@material-ui/core";
import {
    Close,
    Description,
    ExpandLess,
    ExpandMore,
    Folder,
} from "@material-ui/icons";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Example } from "../../agents/Github";
import { Http } from "../../agents/Http";
import { GITHUB_OWNER, GITHUB_REPOSITORY } from "../../config";
import CodeBlock from "./CodeBlock";
import langMap from "lang-map";

const styler = withStyles((theme) => ({
    collapse: {
        marginLeft: theme.spacing(2),
    },
    modal: {
        background: "#a9b6c1",
        width: 700,
        maxHeight: 600,
        overflowY: "auto",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        [theme.breakpoints.down("sm")]: {
            width: "80vw",
            maxWidth: 700,
            maxHeight: "80vh",
            padding: 0,
        },
    },
    modalClose: {
        right: theme.spacing(1),
        top: theme.spacing(1),
        position: "fixed",
        zIndex: 9000,
        display: "none",
        background: theme.palette.grey["200"],
        "&:hover": {
            background: theme.palette.grey["200"],
        },
        [theme.breakpoints.down("sm")]: {
            display: "block",
        },
    },
}));

type FileBrowserProps = RouteComponentProps &
    Example & {
        classes: {
            collapse: string;
            modal: string;
            modalClose: string;
        };
    };

interface FileBrowserState {
    expanded: string[];
    open: boolean;
    loading: boolean;
    data?: string;
}

class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {
    constructor(props: FileBrowserProps) {
        super(props);

        this.state = {
            expanded: [],
            open: false,
            loading: false,
        };
        this.handleToggleFolder = this.handleToggleFolder.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        if (this.props.location.hash.startsWith("#!")) {
            const filePath = props.location.hash.substr(2);
            this.previewFile(filePath);
        }
    }

    public componentDidUpdate(prevProps: FileBrowserProps) {
        const prevHash = prevProps.location.hash;
        const curHash = this.props.location.hash;

        if (prevHash !== curHash && curHash.startsWith("#!")) {
            const filePath = curHash.substr(2);
            this.previewFile(filePath);
        }
    }

    protected previewFile(fileName: string) {
        const { name, commit } = this.props;
        this.setState({
            open: true,
            loading: true,
            data: undefined,
        });

        Http.getContent(
            `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/${commit}/blog/examples/${name}/${fileName}`
        ).then((res) => {
            if (res.isOk()) {
                this.setState({
                    loading: false,
                    data: res.unwrap(),
                });
            } else {
                this.setState({
                    loading: false,
                    data: undefined,
                });
            }
        });
    }

    protected handleToggleFolder(folder: string, expand: boolean) {
        const { expanded } = this.state;
        if (expand) {
            this.setState({
                expanded: [...expanded, folder],
            });
        } else {
            this.setState({
                expanded: expanded.filter((file) => !file.startsWith(folder)),
            });
        }
    }

    protected handleModalClose() {
        this.setState({
            open: false,
        });
        this.props.history.push("#_");
    }

    protected handleModalOpen(file: string) {
        const hash = this.props.location.hash;
        if (
            hash.length !== 0 &&
            hash.startsWith("#!") &&
            hash.substr(2) === file
        ) {
            this.setState({
                open: true,
            });
        }
    }

    protected renderList(files: string[], currentPath?: string): JSX.Element[] {
        const { expanded } = this.state;
        const { classes } = this.props;
        const list: JSX.Element[] = [];
        const subFiles: string[] = [];
        let prevFolder: string | undefined;
        const sortedFiles = files.sort((a, b) => {
            return (
                b.split("/").length - a.split("/").length || a.localeCompare(b)
            );
        });
        sortedFiles.forEach((file) => {
            const fileName = currentPath
                ? file.substr(currentPath.length)
                : file;
            const splitted = fileName.split("/");
            if (splitted.length > 1) {
                if (splitted[0] === prevFolder) {
                    subFiles.push(file);
                } else if (!prevFolder) {
                    prevFolder = splitted[0];
                    subFiles.push(file);
                } else {
                    const nextPath = `${currentPath ?? ""}${prevFolder}/`;
                    const expand = expanded.includes(nextPath);
                    list.push(
                        <ListItem
                            key={nextPath}
                            button
                            divider
                            dense={true}
                            onClick={() =>
                                this.handleToggleFolder(nextPath, !expand)
                            }
                        >
                            <ListItemIcon>
                                <Folder />
                            </ListItemIcon>
                            <ListItemText primary={prevFolder} />
                            {expand ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    );
                    list.push(
                        <Collapse
                            className={classes.collapse}
                            key={nextPath + "+collapse"}
                            in={expand}
                            timeout="auto"
                            unmountOnExit
                        >
                            {this.renderList(subFiles, nextPath)}
                        </Collapse>
                    );
                    prevFolder = splitted[0];
                    subFiles.length = 0;
                    subFiles.push(file);
                }
            } else {
                if (prevFolder) {
                    const nextPath = `${currentPath ?? ""}${prevFolder}/`;
                    const expand = expanded.includes(nextPath);
                    list.push(
                        <ListItem
                            key={nextPath}
                            button
                            divider
                            dense={true}
                            onClick={() =>
                                this.handleToggleFolder(nextPath, !expand)
                            }
                        >
                            <ListItemIcon>
                                <Folder />
                            </ListItemIcon>
                            <ListItemText primary={prevFolder} />
                            {expand ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    );
                    list.push(
                        <Collapse
                            className={classes.collapse}
                            key={nextPath + "+collapse"}
                            in={expand}
                            timeout="auto"
                            unmountOnExit
                        >
                            {this.renderList(subFiles, nextPath)}
                        </Collapse>
                    );
                    prevFolder = undefined;
                    subFiles.length = 0;
                }
                list.push(
                    <ListItem
                        divider={true}
                        href={"#!" + file}
                        component="a"
                        dense={true}
                        onClick={() => this.handleModalOpen(file)}
                        key={file}
                        button
                    >
                        <ListItemIcon>
                            <Description />
                        </ListItemIcon>
                        <ListItemText primary={splitted[0]} />
                    </ListItem>
                );
            }
        });

        return list;
    }

    public render() {
        const {
            files,
            location: { hash },
            classes,
        } = this.props;
        const { loading, open, data } = this.state;

        const fileName = hash.split("/").pop();
        const extension =
            fileName && fileName.includes(".")
                ? fileName.split(".").pop()
                : undefined;

        let language: string | undefined;
        if (extension) {
            language = langMap.languages(extension)[0];
        } else if (data) {
            const firstLine = data.substr(0, data.search("\n"));
            if (firstLine.startsWith("#!/usr/bin/env ")) {
                const compilerMap = new Map();
                compilerMap.set("php", "php");
                language = compilerMap.get(firstLine.split(" ")[1]);
            }
        }

        return (
            <div>
                {open && (
                    <IconButton
                        onClick={this.handleModalClose}
                        color="secondary"
                        className={classes.modalClose}
                        size="small"
                    >
                        <Close />
                    </IconButton>
                )}
                <Modal open={open} onClose={this.handleModalClose}>
                    <Paper className={classes.modal}>
                        {loading && <span>Loading</span>}
                        {!loading && (
                            <CodeBlock
                                onClose={this.handleModalClose}
                                overflow={true}
                                hideViewButton={true}
                                filename={hash.substr(2)}
                                value={data ?? ""}
                                language={language}
                            />
                        )}
                    </Paper>
                </Modal>
                <List>{this.renderList(files)}</List>
            </div>
        );
    }
}

export default withRouter(styler(FileBrowser));
