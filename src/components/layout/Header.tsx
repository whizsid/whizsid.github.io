import { AppBar, Avatar, Button, Toolbar, withStyles, IconButton, Icon } from "@material-ui/core";
import * as React from "react";
import { getSocialLinks } from "../../agent";
import { SocialLink } from "../../types";

const styler = withStyles(theme=>({
    grow: {
        flexGrow: 1,
	},
	brandName: {
		color: theme.palette.common.white
	}
}));

interface HeaderProps {
    classes: {
		grow: string;
		brandName: string;
    };
}

interface HeaderState {
	links: SocialLink[];
	loading: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {

	constructor(props:HeaderProps) {
		super(props);

		this.state = {
			links: [],
			loading: true,
		};

		getSocialLinks().then((response)=>{
			if(response.success){
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

	public render() {
		const { classes } = this.props;
		const {links} = this.state;
		return (
			<AppBar variant="outlined" position="fixed">
				<Toolbar variant="dense">
					<img height="48" src="/logo200.png" alt="WhizSid" />
					<Button
						className={classes.brandName}
					>
						WhizSid
					</Button>
                    <div className={classes.grow} />
					{links.map((link, id)=>(
						<IconButton title={link.name} href={link.link} >
							<img width="32px" src={link.icon}/>
						</IconButton>
					))}
				</Toolbar>
			</AppBar>
		);
	}
}

export default styler (Header);
