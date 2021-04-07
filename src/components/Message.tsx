import * as React from "react";

interface MessageProps {
    time: string;
    message: string;
}

const Message: React.FunctionComponent<MessageProps> = (props: MessageProps): JSX.Element => {
    return (
        <div>
            {props.message}
        </div>
    );
};

export default Message;
