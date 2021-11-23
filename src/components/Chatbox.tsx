import MessageIcon from "@mui/icons-material/Message";
import Fab from "@mui/material/Fab";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";

const useStyles = makeStyles({
    fab: {
        position: "fixed",
        right: "16px",
        bottom: "16px"
    },
    messagesContainer: {
        position: "fixed",
        right: "24px",
        bottom: "40px"
    }
});

interface ChatboxProps {
    open?: boolean;
    loading?: boolean;
    messages: [];
}

const Chatbox: React.FunctionComponent<ChatboxProps> = (): JSX.Element => {
    const styles = useStyles();

    return (
        <div>
            <div>
            </div>
            <Fab className={styles.fab} color="primary" aria-label="chat">
                <MessageIcon />
            </Fab>
        </div>
    );
};

export default Chatbox;
