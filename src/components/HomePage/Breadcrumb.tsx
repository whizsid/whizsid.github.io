import { Theme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import Calendar from "react-github-calendar";
import { Helmet } from "react-helmet";
import myImage from "../../images/me.jpg";
import {FC} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    breadcrumb: {
        height: 500,
        backgroundColor: "#0070c8",
        [theme.breakpoints.down("lg")]: {
            height: "unset",
        },
    },
    breadcrumbLeft: {
        backgroundImage: `url(${myImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "relative",
        borderBottom: "solid 4px hsl(338, 78%, 30%)",
        [theme.breakpoints.down("lg")]: {
            height: 400,
        },
    },
    breadcrumbRight: {
        position: "relative",
        borderBottom: "solid 4px hsl(338, 78%, 58%)",
        [theme.breakpoints.down("lg")]: {
            height: 460,
        },
    },
    whiz: {
        color: theme.palette.common.black,
        fontWeight: "bold",
        position: "absolute",
        right: "0",
        top: 180,
        [theme.breakpoints.down("lg")]: {
            display: "none",
        },
    },
    sid: {
        color: theme.palette.common.white,
        fontWeight: "bold",
        position: "absolute",
        left: "0",
        top: 180,
        [theme.breakpoints.down("lg")]: {
            display: "none",
        },
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
        [theme.breakpoints.down("lg")]: {
            width: "100%",
            textAlign: "center",
            margin: "auto",
            marginLeft: "unset",
            marginTop: 100,
        },
    },
    githubCalendar: {
        position: "absolute",
        width: "90%",
        bottom: 0,
        left: 20,
        textDecoration: "none!important",
        color: theme.palette.common.white + "!important",
    },
    whizsid: {
        color: theme.palette.common.black,
        fontWeight: "bold",
        position: "absolute",
        top: 180,
        textAlign: "center",
        width: "100%",
        display: "none",
        [theme.breakpoints.down("lg")]: {
            display: "block",
        },
    },
    githubCalendarTitle: {
        color: theme.palette.common.white,
    },
}));

const githubCalendarTheme = {
    background: "transparent",
    text: "#fff",
    level4: "rgba(255,255,255,1)",
    level3: "rgba(255,255,255,0.8)",
    level2: "rgba(255,255,255,0.6)",
    level1: "rgba(255,255,255,0.4)",
    level0: "rgba(255,255,255,0.1)",
};

const Breadcrumb: FC = () => {
    const classes = useStyles();
    return (
        <div>
            <Helmet
                link={[
                    {
                        href: "https://fonts.googleapis.com/css2?family=Grandstander&display=swap",
                        rel: "stylesheet",
                    },
                ]}
                style={[
                    {
                        type: "text/css",
                        cssText: `
                        .react-github-calendar__chart text {
                            fill: rgb(255,255,255)!important;
                        }
                        .react-github-calendar__meta {
                            color: #ffffff!important;
                        }`,
                    },
                ]}
            />
            <Grid className={classes.breadcrumb} container={true}>
                <Grid className={classes.breadcrumbLeft} item xs={12} md={6}>
                    <Typography className={classes.whiz} variant="h2">
                        @Whiz
                    </Typography>
                    <Typography className={classes.whizsid} variant="h2">
                        @WhizSid
                    </Typography>
                </Grid>
                <Grid className={classes.breadcrumbRight} item xs={12} md={6}>
                    <Typography className={classes.sid} variant="h2">
                        Sid
                    </Typography>
                    <Typography className={classes.mySelf} variant="caption">
                        "I am a self-taught software engineer and currently
                        working at Arimac. And I am also an undergraduate at
                        SLIIT."
                    </Typography>
                    <a
                        href="https://github.com/whizsid"
                        className={classes.githubCalendar}
                    >
                        <Typography className={classes.githubCalendarTitle}>
                            Opensource Contributions
                        </Typography>
                        <Calendar
                            theme={githubCalendarTheme}
                            username="whizsid"
                            hideColorLegend={true}
                            hideMonthLabels={true}
                            style={{color: "#fff"}}
                        />
                    </a>
                </Grid>
            </Grid>
        </div>
    );
};

export default Breadcrumb;
