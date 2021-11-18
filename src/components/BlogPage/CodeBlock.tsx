import { IconButton, Toolbar, Typography, withStyles } from "@material-ui/core";
import { FileCopy, Launch, Close } from "@material-ui/icons";
import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import theme from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";
import { CopyToClipboard } from "react-copy-to-clipboard";

const styler = withStyles((theme) => ({
    toolbar: {
        minHeight: 32,
        paddingLeft: "8px",
        paddingTop: "16px",
    },
    typography: {
        color: theme.palette.common.white,
        flexGrow: 1,
        textAlign: "center",
        fontSize: "14px",
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        padding: 4,
        color: theme.palette.common.white,
        width: "20px",
        height: "20px",
        marginLeft: "8px",
    },
    wrapper: {
        background: "#2d2d2d",
        borderRadius: "8px",
        boxShadow: '0px 0px 16px rgba(0,0,0,0.4)',
    },
    code: {
        marginTop: 0,
        lineHeight: "133%!important",
        fontFamily: "font-family: Hack, monospace !important",
        fontVariantLigatures: "contextual",
        fontFeatureSettings: '"calt"',
        fontSize: "100%!important",
    },
    buttonIcon: {
        width: "12px",
        height: "12px",
    },
}));

interface CodeBlockProps extends RouteComponentProps {
    onClose?: () => void,
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
        wrapper: string;
        code: string;
        buttonIcon: string;
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

    protected resolveLanguage(lang: string | undefined) {
        console.log(lang);
        switch (lang) {
            case "sh":
                return "bash";
            default:
                return lang;
        }
    }

    public render() {
        const { language, value, classes, filename, hideViewButton, overflow, onClose } =
            this.props;
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
            <div
                className={classes.wrapper}
                style={overflow ? {} : { maxWidth: "100%", overflowX: "auto" }}
            >
                <Toolbar className={classes.toolbar} variant="dense">
                    <IconButton
                        title="Close"
                        className={classes.button}
                        style={{ background: "#ff5f56" }}
                        onClick={onClose}
                    >
                        <Close className={classes.buttonIcon} />
                    </IconButton>
                    {!hideViewButton && generatedFilename && (
                        <IconButton
                            title="Open File"
                            onClick={() =>
                                this.handleClickView(
                                    generatedFilename as string
                                )
                            }
                            className={classes.button}
                            style={{ background: "#ffbd2e" }}
                        >
                            <Launch className={classes.buttonIcon} />
                        </IconButton>
                    )}
                    <CopyToClipboard
                        onCopy={this.handleCopy}
                        text={formattedValue}
                    >
                        <IconButton
                            title="Copy To Clipboard"
                            className={classes.button}
                            style={{ background: "#27c93f" }}
                        >
                            <FileCopy className={classes.buttonIcon} />
                        </IconButton>
                    </CopyToClipboard>
                    <Typography className={classes.typography}>
                        {(generatedFilename || "") +
                            (copied ? " (Copied)" : "")}
                    </Typography>
                </Toolbar>
                <SyntaxHighlighter
                    className={classes.code}
                    language={this.resolveLanguage(language)}
                    style={theme}
                >
                    {formattedValue}
                </SyntaxHighlighter>
            </div>
        );
    }
}

export default withRouter(styler(CodeBlock));
