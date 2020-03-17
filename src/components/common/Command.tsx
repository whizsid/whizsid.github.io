import { IconButton, Toolbar, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import * as React from "react";

interface CommandProps {
	show: boolean;
	onToggle?: () => void;
	command: string;
}

const Command: React.FunctionComponent<CommandProps> = (props: CommandProps) => (
	<Toolbar style={{ paddingLeft: 4 }} variant="dense">
		<IconButton onClick={props.onToggle} color="inherit" size="small">
			{props.show ? <ArrowDropDownIcon /> : <ChevronRightIcon />}
		</IconButton>
		<Typography variant="body1">$ {props.command}</Typography>
	</Toolbar>
);

export default Command;
