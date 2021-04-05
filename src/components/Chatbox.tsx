import * as React from "react";
import { Fab, makeStyles } from "@material-ui/core";
import { Message as MessageIcon } from "@material-ui/icons";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
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
}));

interface ChatboxProps {
    open?: boolean;
    loading?: boolean;
    messages: [];
}

const Chatbox: React.FunctionComponent<ChatboxProps> = (props: ChatboxProps): JSX.Element => {
    const { loading, open } = props;
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
