import Close from "@mui/icons-material/Close";
import FileCopy from "@mui/icons-material/FileCopy";
import Launch from "@mui/icons-material/Launch";
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useState, FC } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import theme from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";

const useStyles = makeStyles((theme: Theme) => ({
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
        boxShadow: "0px 0px 8px rgba(0,0,0,0.4)",
    },
    code: {
        marginTop: 0,
        lineHeight: "133%!important",
        fontFamily: "Hack, monospace !important",
        fontVariantLigatures: "contextual",
        fontFeatureSettings: '"calt"',
        fontSize: ".7em!important",
    },
    buttonIcon: {
        width: "12px",
        height: "12px",
    },
}));

interface ICodeBlockProps {
    onClose?: () => void;
    language?: string;
    value: string;
    filename?: string;
    hideViewButton?: boolean;
    overflow?: boolean;
}

const resolveLanguage = (lang: string | undefined) => {
    switch (lang) {
        case "sh":
            return "bash";
        case "make":
            return "makefile";
        default:
            return lang;
    }
};

const CodeBlock: FC<ICodeBlockProps> = ({
    language,
    value,
    filename,
    hideViewButton,
    overflow,
    onClose,
}: ICodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const classes = useStyles();

    const handleCopy = () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1000);
    };

    const handleClickView = (filename: string) => {
        navigate("#!" + filename);
    };

    let formattedValue = value.trim();
    const firstLineEnd = formattedValue.search("\n");
    const firstLine = formattedValue.substr(0, formattedValue.search("\n"));
    let generatedFilename: string | undefined = filename;
    if (
        firstLine.startsWith("# ") &&
        !firstLine.substr(2).includes(" ") &&
        !filename
    ) {
        generatedFilename = firstLine.substr(2);
        formattedValue = value.substr(firstLineEnd + 1).trim();
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
                    size="large"
                >
                    <Close className={classes.buttonIcon} />
                </IconButton>
                {!hideViewButton && generatedFilename && (
                    <IconButton
                        title="Open File"
                        onClick={() =>
                            handleClickView(generatedFilename as string)
                        }
                        className={classes.button}
                        style={{ background: "#ffbd2e" }}
                        size="large"
                    >
                        <Launch className={classes.buttonIcon} />
                    </IconButton>
                )}
                <CopyToClipboard onCopy={handleCopy} text={formattedValue}>
                    <IconButton
                        title="Copy To Clipboard"
                        className={classes.button}
                        style={{ background: "#27c93f" }}
                        size="large"
                    >
                        <FileCopy className={classes.buttonIcon} />
                    </IconButton>
                </CopyToClipboard>
                <Typography className={classes.typography}>
                    {(generatedFilename || "") + (copied ? " (Copied)" : "")}
                </Typography>
            </Toolbar>
            <SyntaxHighlighter
                codeTagProps={{className: classes.code}}
                language={resolveLanguage(language)}
                style={theme}
            >
                {formattedValue}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
