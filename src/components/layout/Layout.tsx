import { CssBaseline, Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import Drawer from "./Drawer";
import Header from "./Header";

interface Props {
	children: React.ReactChild;
	header?: boolean;
	classes: {
        wrapper: string;
        root: string;
	};
}

const styler = withStyles((theme: Theme) => ({
	wrapper: {
		paddingTop: theme.spacing(7),
		color: theme.palette.text.primary,
		background: theme.palette.grey[900],
        minHeight: "100vh",
        flexGrow: 1
    },
    root: {
        display: "flex"
    }
}));

interface State {
	drawerOpen: boolean;
}

class Layout extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			drawerOpen: false
		};
	}

	public static defaultProps = {
		header: true
	};

	handleToggleDrawer = (open: boolean) => {
		this.setState({
			drawerOpen: open
		});
	}

	public render() {
		const { children, classes } = this.props;
		const { drawerOpen } = this.state;

		return (
			<div className={classes.root} >
                <CssBaseline />
				<Header />
				<Drawer onToggle={this.handleToggleDrawer} open={drawerOpen} />
				<div style={{
                    paddingLeft: drawerOpen ? 164 : 84
                }} className={classes.wrapper}>{children}</div>
			</div>
		);
	}
}

export default styler(Layout);
