import { makeStyles, Grid, Typography, SvgIcon, IconButton } from "@material-ui/core";
import * as React from "react";
import GaugeChart from "react-gauge-chart";
import { SimpleIcon } from "simple-icons";
import { Info } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    container: {
        position: "relative"
    },
    gauge: {
        marginTop: "20px",
    },
    typography: {
        color: theme.palette.common.white,
        marginBottom: "8px",
        textAlign: "center"
    },
    icon: {
        marginRight: "8px"
    },
    infoIcon: {
        position: "absolute",
        top: "4px",
        right: "4px",
        color: "#017bf8"
    }
}));

interface SkillGaugeProps {
    percent: number;
    language: string;
    icon: SimpleIcon;
}

const SkillGauge: React.FunctionComponent<SkillGaugeProps> = (props: SkillGaugeProps): JSX.Element => {
    const styles = useStyles();

    return (
        <Grid className={styles.container} item={true}>
            <IconButton className={styles.infoIcon} >
                <Info />
            </IconButton>
            <GaugeChart
                className={styles.gauge}
                style={{ width: "180px" }}
                nrOfLevels={30}
                colors={["#FF5F6D", "#FFC371"]}
                arcWidth={0.3}
                id="laravel"
                percent={props.percent}
                needleColor="#FFEECC"
                textColor="#F0F0F0"
            />
            <Typography className={styles.typography} variant="h6" >
                <SvgIcon className={styles.icon}>
                    <path d={props.icon.path} fill={"#" + props.icon.hex} />
                </SvgIcon>
                {props.language}
            </Typography>
        </Grid>
    );
};

export default SkillGauge;
