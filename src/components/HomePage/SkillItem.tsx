import { makeStyles, SvgIcon } from "@material-ui/core";
import { SimpleIcon } from "simple-icons";
import * as React from "react";

const useStyles = makeStyles(() => ({
	icon: {
		display: "block",
		width: "80px",
		height: "80px",
		position: "absolute"
	}
}));

export interface SkillItemProp {
	title: string;
	icon: SimpleIcon;
}

const SkillItem = (prop: SkillItemProp) => {
    const classes = useStyles();
    const durationX = 3 + 2*Math.random();
    const durationY = 3 + 2*Math.random();
    const durationSize = ((durationX + durationY)/4).toPrecision(2);
    const typeX = ["L","R"][Math.round(Math.random())];
    const typeY = ["T","B"][Math.round(Math.random())];
    const animationCss = `moveX${typeX} ${durationX.toPrecision(2)}s linear 0s infinite alternate, moveY${typeY} ${durationY.toPrecision(2)}s linear 0s infinite alternate, sizeI ${durationSize}s linear 0s infinite alternate`;
    return (<SvgIcon
        style={{
            WebkitAnimation:animationCss,
            MozAnimation: animationCss,
            OAnimation: animationCss,
            animation: animationCss
        }}
        className={classes.icon}
    >
        <path d={prop.icon.path} fill={"#" + prop.icon.hex} />
    </SvgIcon>);
};

export default SkillItem;