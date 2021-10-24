import { makeStyles, Typography } from "@material-ui/core";
import * as React from "react";
import { SimpleIcon } from "simple-icons";
import SkillItem from "./SkillItem";

const useStyles = makeStyles(() => ({
	root: {
		width: "300px",
		height: "300px",
		border: "4px #ebebeb solid",
		borderRadius: "8px",
		position: "relative",
        margin: "16px auto",
	},
	title: {
		fontSize: "20px",
		display: "inline-block",
		lineHeight: "28px",
		marginTop: "0",
		marginBottom: "0",
		position: "absolute",
		color: "#404040",
		top: "0",
		left: "0",
		paddingRight: "8px",
		paddingBottom: "4px",
		background: "#ebebeb",
        borderBottomRightRadius: '8px',
	}
}));

export interface Skill {
	title: string;
	icon: SimpleIcon;
}

export interface SkillBoxProps {
	title: string;
	skills: Skill[];
}

const SkillBox = (props: SkillBoxProps) => {
	const classes = useStyles();

	return (
		<div id="skillBox" className={classes.root}>
			{props.skills.map((s) => <SkillItem {...s} />)}
			<Typography className={classes.title}>{props.title}</Typography>
		</div>
	);
};

export default SkillBox;
