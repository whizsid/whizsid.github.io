import { AppBar, Button, IconButton, Toolbar, withStyles } from "@material-ui/core";
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import { getSocialLinks } from "../../agent";
import { SocialLink } from "../../types";

const styler = withStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		borderBottom: "solid 2px " + theme.palette.text.primary
	},
	grow: {
		flexGrow: 1
	},
	brandName: {
		color: theme.palette.common.white
	}
}));

interface HeaderProps {
	classes: {
		appBar: string;
		grow: string;
		brandName: string;
	};
}

interface HeaderState {
	links: SocialLink[];
	loading: boolean;
}

class Header extends React.Component<HeaderProps & RouteComponentProps, HeaderState> {
	constructor(props: HeaderProps & RouteComponentProps) {
		super(props);

		this.state = {
			links: [],
			loading: true
		};

		getSocialLinks().then((response) => {
			if (response.success) {
				this.setState({
					links: response.links,
					loading: false
				});
			} else {
				this.setState({
					loading: false
				});
			}
		});
	}

	handleClickBrandName = ()=>{
		this.props.history.push("/");
	}

	public render() {
		const { classes } = this.props;
		const { links } = this.state;

		return (
			<AppBar className={classes.appBar} variant="outlined" position="fixed">
				<Toolbar variant="dense">
					<Button onClick={this.handleClickBrandName} className={classes.brandName}>WhizSid</Button>
					<div className={classes.grow} />
					{links.map((link, key) => (
						<IconButton key={key} title={link.name} href={link.link}>
							<img alt={"Transparent SVG " + link.name + " icon by simpleicons.org"} width="32px" src={link.icon} />
						</IconButton>
					))}
				</Toolbar>
			</AppBar>
		);
	}
}

export default styler( withRouter(Header));
