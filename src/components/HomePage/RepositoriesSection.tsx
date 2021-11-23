import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useState, useEffect, FC } from "react";
import { Helmet } from "react-helmet";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Github, Repository } from "../../agents/Github";
import RepositoryCard from "./RepositoryCard";
import RepositoryCardPlaceholder from "./RepositoryCardPlaceholder";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: "#f6f8fa",
        borderBottom: "solid 32px #f0f0f0",
    },
    header: {
        background: "#b0b0b0",
        color: theme.palette.common.white,
        borderBottom: "2px solid #f0f0f0",
        position: "relative",
        height: 42,
        fontWeight: "bold",
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
}));

const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const RepositoriesSection: FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [repos, setRepos] = useState([] as Repository[]);
    const classes = useStyles();

    useEffect(() => {
        Github.repos().then((res) => {
            setLoading(false);
            if (res.isOk()) {
                setRepos(res.unwrap());
            } else {
                setError(true);
            }
        });
    }, []);

    if (error) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Helmet
                style={[
                    {
                        cssText: `
                                .slick-track {
                                    display: flex!important;
                                    flex-direction: row!important;
                                }

                                .slick-slide {
                                    display: flex!important;
                                    flex-direction: row!important;
                                    flex-grow: 1!important;
                                    height: inherit !important;
                                }
                            `,
                        type: "text/css",
                    },
                ]}
            />
            <div className={classes.header}>
                <Typography color="inherit" variant="h6">
                    Opensource Projects
                </Typography>
            </div>
            {loading ? (
                <Slider {...slickSettings}>
                    {[0, 0, 0, 0, 0, 0, 0].map((_v, k) => (
                        <RepositoryCardPlaceholder key={k} />
                    ))}
                </Slider>
            ) : (
                <Slider {...slickSettings}>
                    {repos.map((repo, k) => (
                        <RepositoryCard key={k} {...repo} />
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default RepositoriesSection;
