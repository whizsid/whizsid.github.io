import * as React from "react";
import GaugeChart from 'react-gauge-chart';
import {Typography, withStyles, Theme, Grid} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";
import SkillGauge from "./SkillGauge";
import {SimpleIcon} from "simple-icons";
const simpleicons = require("simple-icons");

const styler = withStyles((theme: Theme) => ({
    header: {
        background: "#606060",
        paddingTop: "8px",
        paddingBottom: "8px",
        textAlign: "center",
        color: theme.palette.common.white
    },
    container: {
        background: "#404040"
    }
}));

interface SkillsSectionProps {
    classes: {
        header: string;
        container: string;
    };
}

interface Icons {
    laravel?: SimpleIcon;
    php?: SimpleIcon;
    react?: SimpleIcon;
    symfony?: SimpleIcon;
    rust?: SimpleIcon;
}

interface SkillsSectionState {
    icons: Icons;
}

interface Skill {
    title: string;
    iconName: keyof Icons;
    percent: number;
}

const skills: Skill[] = [
    {
        title: "Laravel",
        iconName: "laravel",
        percent: 0.8
    }
];

class SkillsSection extends React.Component<SkillsSectionProps, SkillsSectionState> {

    constructor(props: SkillsSectionProps) {
        super(props);

        this.state = {
            icons: {}
        };
        for (const skill of skills) {
            this.state = {
                ...this.state,
                icons: {
                    ...this.state.icons,
                    [skill.iconName]: simpleicons.get(skill.iconName)
                }
            };
        }
    }

    public render() {

        const {classes} = this.props;
        const {icons} = this.state;

        return (
            <div className={classes.container} >
                <Typography className={classes.header} variant="h5"> Skills </Typography>
                <Grid container={true}>
                    {skills.map((skill, i) => (
                        icons[skill.iconName] && (<SkillGauge key={i} percent={skill.percent} language={skill.title} icon={icons[skill.iconName] as SimpleIcon} />)
                    ))}
                </Grid>
            </div>
        )
    }
}

export default styler(SkillsSection);
