import { IconButton, Toolbar, Typography, withStyles } from "@material-ui/core";
import { FileCopy, Launch } from "@material-ui/icons";
import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import githubGist from "react-syntax-highlighter/dist/esm/styles/prism/ghcolors";
import { CopyToClipboard } from "react-copy-to-clipboard";

const styler = withStyles((theme) => ({
    toolbar: {
        background: theme.palette.grey["600"],
        minHeight: 32,
    },
    typography: {
        color: theme.palette.common.white,
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        padding: 4,
        color: theme.palette.common.white,
    },
}));

interface CodeBlockProps extends RouteComponentProps {
    language?: string;
    value: string;
    filename?: string;
    hideViewButton?: boolean;
    overflow?: boolean;
    classes: {
        toolbar: string;
        typography: string;
        grow: string;
        button: string;
    };
}

interface CodeBlockState {
    copied: boolean;
}

class CodeBlock extends PureComponent<CodeBlockProps, CodeBlockState> {
    constructor(props: CodeBlockProps) {
        super(props);

        this.handleCopy = this.handleCopy.bind(this);
        this.state = {
            copied: false,
        };
    }

    protected handleCopy() {
        this.setState(
            {
                copied: true,
            },
            () => {
                window.setTimeout(() => {
                    this.setState({
                        copied: false,
                    });
                }, 1000);
            }
        );
    }

    protected handleClickView(filename: string) {
        this.props.history.push("#!" + filename);
    }

    public render() {
        const {
            language,
            value,
            classes,
            filename,
            hideViewButton,
            overflow
        } = this.props;
        const { copied } = this.state;
        const firstLineEnd = value.search("\n");
        const firstLine = value.substr(0, value.search("\n"));
        let formattedValue = value;
        let generatedFilename: string | undefined = filename;
        if (
            firstLine.startsWith("# ") &&
            !firstLine.substr(2).includes(" ") &&
            !filename
        ) {
            generatedFilename = firstLine.substr(2);
            formattedValue = value.substr(firstLineEnd + 1).trimStart();
        }

        return (
            <div style={overflow?{}:{ maxWidth:  "100%", overflowX: "auto" }}>
                <Toolbar className={classes.toolbar} variant="dense">
                    <Typography className={classes.typography}>
                        {generatedFilename}
                    </Typography>
                    <div className={classes.grow} />

                    {copied && (
                        <Typography className={classes.typography}>
                            Copied!
                        </Typography>
                    )}

                    <CopyToClipboard
                        onCopy={this.handleCopy}
                        text={formattedValue}
                    >
                        <IconButton
                            title="Copy To Clipboard"
                            className={classes.button}
                        >
                            <FileCopy />
                        </IconButton>
                    </CopyToClipboard>
                    {!hideViewButton && generatedFilename && (
                        <IconButton
                            title="Open File"
                            onClick={() =>
                                this.handleClickView(
                                    generatedFilename as string
                                )
                            }
                            className={classes.button}
                        >
                            <Launch />
                        </IconButton>
                    )}
                </Toolbar>
                <SyntaxHighlighter
                    customStyle={{ marginTop: 0 }}
                    language={language}
                    style={githubGist}
                >
                    {formattedValue}
                </SyntaxHighlighter>
            </div>
        );
    }
}

export default withRouter(styler(CodeBlock));
