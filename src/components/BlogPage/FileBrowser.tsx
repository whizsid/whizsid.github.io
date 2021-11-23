import Close from "@mui/icons-material/Close";
import Description from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Folder from "@mui/icons-material/Folder";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import langMap from "lang-map";
import { FC, useEffect, useState } from "react";
import { Example } from "../../agents/Github";
import { Http } from "../../agents/Http";
import { GITHUB_OWNER, GITHUB_REPOSITORY } from "../../config";
import CodeBlock from "./CodeBlock";
import { useLocation, useNavigate } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
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
        [theme.breakpoints.down("md")]: {
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
        [theme.breakpoints.down("md")]: {
            display: "block",
        },
    },
}));

type FileBrowserProps = Example;

const FileBrowser: FC<FileBrowserProps> = ({ commit, name, files }: FileBrowserProps) => {
    const [expanded, setExpanded] = useState([] as string[]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null as string | null);
    const location = useLocation();
    const navigate = useNavigate();
    const classes = useStyles();

    const previewFile = (fileName: string) => {
        setOpen(true);
        setLoading(true);
        setData(null);
        Http.getContent(
            `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/${commit}/blog/examples/${name}/${fileName}`
        )
            .then((res) => {
                setLoading(false);
                if (res.isOk()) {
                    setData(res.unwrap());
                }
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (location.hash.startsWith("#!")) {
            const filePath = location.hash.substr(2);
            previewFile(filePath);
        }
    }, [location.hash]);

    const handleToggleFolder = (folder: string, expand: boolean) => {
        if (expand) {
            setExpanded([...expanded, folder]);
        } else {
            setExpanded(expanded.filter((file) => !file.startsWith(folder)));
        }
    };

    const handleModalClose = () => {
        setOpen(false);
        navigate("#_");
    };

    const handleModalOpen = (file: string) => {
        const hash = location.hash;
        if (
            hash.length !== 0 &&
            hash.startsWith("#!") &&
            hash.substr(2) === file
        ) {
            setOpen(true);
        }
    };

    const renderList = (
        files: string[],
        currentPath?: string
    ): JSX.Element[] => {
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
                                handleToggleFolder(nextPath, !expand)
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
                            {renderList(subFiles, nextPath)}
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
                                handleToggleFolder(nextPath, !expand)
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
                            {renderList(subFiles, nextPath)}
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
                        onClick={() => handleModalOpen(file)}
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
    };

    const fileName = location.hash.split("/").pop();
    const extension =
        fileName && fileName.includes(".")
            ? fileName.split(".").pop()
            : undefined;

    let language: string | undefined;
    if (extension) {
        switch(extension){
            case "m":
                language = "matlab";
                break;
            case "cpp":
                language = "cpp";
                break;
            default:
                language = langMap.languages(extension)[0];
                break;
        }
    } else if (data) {
        const firstLine = data.substr(0, data.search("\n"));
        if (firstLine.startsWith("#!/usr/bin/env ")) {
            const compilerMap = new Map();
            compilerMap.set("php", "php");
            language = compilerMap.get(firstLine.split(" ")[1]);
        } else if (fileName?.endsWith("Makefile")) {
            language = "makefile";
        }
    }

    return (
        <div>
            {open && (
                <IconButton
                    onClick={handleModalClose}
                    color="secondary"
                    className={classes.modalClose}
                    size="small"
                >
                    <Close />
                </IconButton>
            )}
            <Modal open={open} onClose={handleModalClose}>
                <Paper className={classes.modal}>
                    {loading && <span>Loading</span>}
                    {!loading && (
                        <CodeBlock
                            onClose={handleModalClose}
                            overflow={true}
                            hideViewButton={true}
                            filename={location.hash.substr(2)}
                            value={data ?? ""}
                            language={language}
                        />
                    )}
                </Paper>
            </Modal>
            <List>{renderList(files)}</List>
        </div>
    );
};

export default FileBrowser;
