import * as React from "react";
import { Helmet } from "react-helmet";
import Chatbox from "../components/Chatbox";
import Header from "../components/Header";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import ContactSection from "../components/HomePage/ContactSection";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import SkillsSection from "../components/HomePage/SkillsSection";
import { SITE_URL } from "../config";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
    public render() {
        return (
            <div>
                <Helmet>
                    <title>WhizSid | Portfolio & Blog</title>
                    <meta
                        property="og:title"
                        content="WhizSid | Portfolio & Blog"
                    />
                    <meta
                        name="description"
                        content="I am working as a software\
            engineer at Arimac. And also I am an undergraduate at SLIIT.\
            This is my personal website and the blog site.\
            You can check my latest blog posts and statuses with this website."
                    />
                    <meta
                        name="keywords"
                        content="whizsid, rust, typescript, php, github,\
            laravel, rust, sri lanka, sliit, arimac, ceylon linux, nvision, masterbrand\
            matugama, colombo, meegahathanna, experienced, developer, software engineer,\
            salesforce, iot, docker"
                    />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={SITE_URL} />
                    <meta
                        property="og:image"
                        content={SITE_URL + "img/opengraph.png"}
                    />
                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                    />
                    <script
                        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                    ></script>
                </Helmet>
                <Header
                    widgets={
                        <Button
                            style={{ marginLeft: 16, borderColor: "#fff" }}
                            variant="outlined"
                            size="small"
                            component={Link}
                            to="/search.html"
                        >
                            Visit Blog
                        </Button>
                    }
                    homepage={true}
                />
                <Breadcrumb />
                <RepositoriesSection />
                <BlogPostsSection />
                <SkillsSection />
                <ContactSection />
                <Chatbox messages={[]} />
            </div>
        );
    }
}

export default HomePage;
