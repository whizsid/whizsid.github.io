import { AppBar, Button, IconButton, Toolbar, withStyles } from "@material-ui/core";
import clsx from "clsx";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import githubIcon from "../images/social/github.svg";
import twitterIcon from "../images/social/twitter.svg";

const styler = withStyles((theme) => ({
appBar: {
zIndex: theme.zIndex.drawer + 1,
},
grow: {
flexGrow: 1
},
brandName: {
color: theme.palette.common.white
},
transparent: {
backgroundColor: "transparent",
boxShadow: "none"
}
}));

interface HeaderProps {
classes: {
transparent: string;
appBar: string;
grow: string;
brandName: string;
		 };
}

interface HeaderState {
loading: boolean;
inBreadcrumb: boolean;
}

class Header extends React.Component<HeaderProps & RouteComponentProps, HeaderState> {
	constructor(props: HeaderProps & RouteComponentProps) {
		super(props);

		this.state = {
loading: true,
		 inBreadcrumb: true
		};

		window.addEventListener("scroll", (e) => {
				this.setState({ inBreadcrumb: !(window.scrollY > 180) });
				});
	}

	handleClickBrandName = () => {
		this.props.history.push("/");
	}

	public render() {
		const { classes } = this.props;
		const { inBreadcrumb } = this.state;

		return (
				<AppBar className={clsx(classes.appBar, inBreadcrumb ? classes.transparent : undefined)} variant="elevation" position="fixed">
				<Toolbar variant="dense">
				{!inBreadcrumb&&(
						<Button onClick={this.handleClickBrandName} className={classes.brandName}>WhizSid</Button>
						)}
				<div className={classes.grow} />
				<IconButton title="twitter" href="#">
				<img alt={"Transparent SVG twitter icon by simpleicons.org"} width="32px" src={twitterIcon} />
				</IconButton>
				<IconButton title="github" href="#">
				<img alt={"Transparent SVG github icon by simpleicons.org"} width="32px" src={githubIcon} />
				</IconButton>
				</Toolbar>
				</AppBar>
			   );
	}
}

export default styler(withRouter(Header));
