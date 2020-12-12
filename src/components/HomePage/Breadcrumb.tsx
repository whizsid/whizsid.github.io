import { Grid, Typography, withStyles } from "@material-ui/core";
import * as React from "react";
import Calendar from "react-github-calendar";
import { Helmet } from "react-helmet";
import myImage from "../../images/me.jpg";

const styler = withStyles(theme=>({
    breadcrumb: {
        height: 500,
        backgroundColor: "#0070c8",
        [theme.breakpoints.down("md")]:{
            height: "unset"
        }
    },
    breadcrumbLeft: {
        backgroundImage: `url(${myImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "relative",
        borderBottom: "solid 4px hsl(338, 78%, 30%)",
        [theme.breakpoints.down("md")]:{
            height: 400
        }
    },
    breadcrumbRight: {
        position: "relative",
        borderBottom: "solid 4px hsl(338, 78%, 58%)",
        [theme.breakpoints.down("md")]:{
            height: 460
        }
    },
    whiz: {
        color: theme.palette.common.black,
        fontWeight: "bold",
        position: "absolute",
        right: "0",
        top: 180,
        [theme.breakpoints.down("md")]:{
            display: "none"
        }
    },
    sid: {
        color: theme.palette.common.white,
        fontWeight: "bold",
        position: "absolute",
        left: "0",
        top: 180,
        [theme.breakpoints.down("md")]:{
            display: "none"
        }
    },
    mySelf: {
        color: theme.palette.common.white,
        fontFamily: "'Grandstander', cursive",
        width: 300,
        display: "block",
        marginLeft: 200,
        marginTop: 100,
        fontSize: 20,
        textAlign: "center",
        [theme.breakpoints.down("md")]:{
            width: "100%",
            textAlign: "center",
            margin: "auto",
            marginLeft: "unset",
            marginTop: 100
        }
    },
    githubCalendar: {
        position: "absolute",
        width: "90%",
        bottom: 0,
        left: 20,
        textDecoration: "none!important",
        color: theme.palette.common.white + "!important"
    },
    whizsid: {
        color: theme.palette.common.black,
        fontWeight: "bold",
        position: "absolute",
        top: 180,
        textAlign: "center",
        width: "100%",
        display: "none",
        [theme.breakpoints.down("md")]:{
            display: "block"
        }
    }
}));

const githubCalendarTheme = {
    background: "transparent",
    text: "#fff",
    grade4: "rgba(255,255,255,1)",
    grade3: "rgba(255,255,255,0.8)",
    grade2: "rgba(255,255,255,0.6)",
    grade1: "rgba(255,255,255,0.4)",
    grade0: "rgba(255,255,255,0.1)",
  };

interface BreadcrumbProps {
    classes: {
        breadcrumb: string;
        breadcrumbLeft: string;
        breadcrumbRight: string;
        whiz: string;
        sid: string;
        whizsid: string;
        mySelf: string;
        githubCalendar: string;
    };
}

class Breadcrumb extends React.Component<BreadcrumbProps> {
    public render(){
        const {classes} = this.props;
        return (<div>
            <Helmet
                link={[
                    {
                        href:"https://fonts.googleapis.com/css2?family=Grandstander&display=swap",
                        rel:"stylesheet"
                    }
                ]}
                style={[
                    {
                        type:"text/css",
                        cssText: `
                        .react-github-calendar__chart text {
                            fill: rgb(255,255,255)!important;
                        }
                        .react-github-calendar__meta {
                            color: #ffffff!important;
                        }`}
                ]}
            />
            <Grid className={classes.breadcrumb} container={true}>
                <Grid className={classes.breadcrumbLeft} item xs={12} md={6}>
                    <Typography className={classes.whiz} variant="h2">@Whiz</Typography>
                    <Typography className={classes.whizsid} variant="h2">@WhizSid</Typography>
                </Grid>
                <Grid className={classes.breadcrumbRight} item xs={12} md={6}>
                    <Typography className={classes.sid} variant="h2">Sid</Typography>
                    <Typography className={classes.mySelf} variant="caption">"I am a self-taught software engineer and currently working on Nvision IT Solutions (PVT) LTD. And I am also an undergraduate at SLIIT."</Typography>
                    <a href="https://github.com/whizsid" className={classes.githubCalendar}>
                        <Typography>Opensource Contributions</Typography>
                        <Calendar theme={githubCalendarTheme} username="whizsid" />
                    </a>
                </Grid>
            </Grid>
        </div>);
    }
}

export default styler(Breadcrumb);