import { Theme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useState, useEffect, FC } from "react";
import { SimpleIcon } from "simple-icons";
import * as THREE from "three";
import SkillBox from "./SkillBox";
import simpleicons from "simple-icons";

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        background: "#606060",
        padding: theme.spacing(1),
        color: theme.palette.common.white,
    },
    container: {
        position: "relative",
    },
}));

type Icons = Record<string, SimpleIcon>;

export interface Skill {
    title: string;
    iconName: string;
}

(window as any).initSkills = () => {
    try {
        const content = document.querySelector(".content-canvas") as Element;
        const s = {
            w:
                document.getElementById("skillSection")?.clientWidth ||
                window.innerWidth,
            h: document.getElementById("skillSection")?.clientHeight || 500,
        };

        const gl = {
            renderer: new THREE.WebGLRenderer({ antialias: true }),
            camera: new THREE.PerspectiveCamera(75, s.w / s.h, 0.1, 100),
            scene: new THREE.Scene(),
            loader: new THREE.TextureLoader(),
        } as Record<string, any>;

        let time = 0;

        const addScene = () => {
            gl.camera.position.set(0, 0, 1);
            gl.scene.add(gl.camera);

            gl.renderer.setSize(s.w, s.h);
            gl.renderer.setPixelRatio(devicePixelRatio);
            content.appendChild(gl.renderer.domElement);

            mesh();
        };

        const uniforms = {
            time: { type: "f", value: 0 },
            resolution: {
                type: "v2",
                value: new THREE.Vector2(s.w, s.h),
            },
            mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
            waveLength: { type: "f", value: 1.2 },
            texture1: {
                value: gl.loader.load(
                    "https://images.unsplash.com/photo-1513343041531-f73bffeed81b?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                ),
            },
        };

        const getGeom = () => new THREE.PlaneGeometry(1, 1, 64, 64);

        const getMaterial = () => {
            return new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms,
                vertexShader: document.querySelector("#vertex-shader")!
                    .textContent as string,
                fragmentShader: document.querySelector("#fragment-shader")!
                    .textContent as string,
            });
        };

        const mesh = () => {
            gl.geometry = getGeom();
            gl.material = getMaterial();

            gl.mesh = new THREE.Mesh(gl.geometry, gl.material);

            gl.scene.add(gl.mesh);
        };

        const update = () => {
            time += 0.05;
            gl.material.uniforms.time.value = time;

            render();
            requestAnimationFrame(update);
        };

        const render = () => gl.renderer.render(gl.scene, gl.camera);

        const resize = () => {
            const w = s.w;
            const h = s.h;

            gl.camera.aspect = w / h;
            gl.renderer.setSize(w, h);

            const dist = gl.camera.position.z - gl.mesh.position.z;
            const height = 1;

            gl.camera.fov =
                2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

            if (w / h > 1) gl.mesh.scale.x = gl.mesh.scale.y = (1.05 * w) / h;

            gl.camera.updateProjectionMatrix();
        };

        addScene();
        update();
        resize();
        window.addEventListener("resize", resize);
    } catch (e) {
        console.error(e);
    }
};

const languages: Skill[] = [
    {
        title: "PHP",
        iconName: "php",
    },
    {
        title: "JavaScript",
        iconName: "javascript",
    },
    {
        title: "C++",
        iconName: "cplusplus",
    },
    {
        title: "Rust",
        iconName: "rust",
    },
    {
        title: "CSS",
        iconName: "css3",
    },
    {
        title: "HTML",
        iconName: "html5",
    },
    {
        title: "Bash",
        iconName: "gnubash",
    },
    {
        title: "Java",
        iconName: "java",
    },
    {
        title: "TypeScript",
        iconName: "typescript",
    },
    {
        title: "Python",
        iconName: "python",
    },
];
const frameworks: Skill[] = [
    {
        title: "Laravel",
        iconName: "laravel",
    },
    {
        title: "Symfony",
        iconName: "symfony",
    },
    {
        title: "NestJS",
        iconName: "nestjs",
    },
    {
        title: "ReactJS",
        iconName: "react",
    },
    {
        title: "AngularJS",
        iconName: "angular",
    },
    {
        title: "Spring",
        iconName: "spring",
    },
];

const techs: Skill[] = [
    {
        title: "AWS",
        iconName: "amazonaws",
    },
    {
        title: "Git",
        iconName: "git",
    },
    {
        title: "Docker",
        iconName: "docker",
    },
    {
        title: "Octave",
        iconName: "octave",
    },
    {
        title: "MongoDB",
        iconName: "mongodb",
    },
    {
        title: "MySQL",
        iconName: "mysql",
    },
    {
        title: "PostgreSQL",
        iconName: "postgresql",
    },
    {
        title: "Electron",
        iconName: "electron",
    },
    {
        title: "Linux",
        iconName: "linux",
    },
];

const SkillsSection: FC = () => {
    const [icons, setIcons] = useState({} as Icons);
    const classes = useStyles();

    useEffect(() => {
        let newIcons = {};
        for (const skill of [...languages, ...frameworks, ...techs]) {
            newIcons = {
                ...newIcons,
                [skill.iconName]: simpleicons.Get(skill.iconName),
            };
        }
        setIcons(newIcons);
    }, []);

    return (
        <div id="skillSection" className={classes.container}>
            <Typography className={classes.header} variant="h6">
                Skills Pool
            </Typography>
            <Grid container justifyContent="center">
                <Grid xs={12} md={4} item>
                    <SkillBox
                        skills={languages.map((s) => ({
                            icon: icons[s.iconName] as any,
                            title: s.title,
                        }))}
                        title="Languages"
                    />
                </Grid>
                <Grid xs={12} md={4} item>
                    <SkillBox
                        skills={frameworks.map((s) => ({
                            icon: icons[s.iconName] as any,
                            title: s.title,
                        }))}
                        title="Frameworks"
                    />
                </Grid>
                <Grid xs={12} md={4} item>
                    <SkillBox
                        skills={techs.map((s) => ({
                            icon: icons[s.iconName] as any,
                            title: s.title,
                        }))}
                        title="Techs"
                    />
                </Grid>
            </Grid>
            <div className="content-canvas" />
        </div>
    );
};

export default SkillsSection;
