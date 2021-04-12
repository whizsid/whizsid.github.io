import {Grid, Theme, Typography, withStyles} from "@material-ui/core";
import * as React from "react";
import {SimpleIcon} from "simple-icons";
import SkillGauge from "./SkillGauge";
const simpleicons = require("simple-icons");

const styler = withStyles((theme: Theme) => ({
    header: {
        background: "#606060",
        padding: theme.spacing(1),
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
    "node-dot-js"?: SimpleIcon;
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
    },
    {
        title: "PHP",
        iconName: "php",
        percent: 0.9
    },
    {
        title: "React",
        iconName: "react",
        percent: 0.8
    },
    {
        title: "Symfony",
        iconName: "symfony",
        percent: 0.7
    },
    {
        title: "Rust",
        iconName: "rust",
        percent: 0.6
    },
    {
        title: "NodeJS",
        iconName: "node-dot-js",
        percent: 0.5
    },
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
                <Typography className={classes.header} variant="h6"> Skills </Typography>
                <Grid container={true} justify="center" >
                    {skills.map((skill, i) => (
                        icons[skill.iconName] && (<SkillGauge key={i} percent={skill.percent} language={skill.title} icon={icons[skill.iconName] as SimpleIcon} />)
                    ))}
                </Grid>
            </div>
        );
    }
}

export default styler(SkillsSection);
