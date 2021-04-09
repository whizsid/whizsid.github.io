import * as React from "react";
import {Helmet} from "react-helmet";
import Chatbox from "../components/Chatbox";
import Header from "../components/Header";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import SkillsSection from "../components/HomePage/SkillsSection";
import {SITE_URL} from "../config";

class HomePage extends React.Component {
    public render() {
        return (<div>
            <Helmet>
                    <title>WhizSid | Portfolio & Blog</title>
                    <meta property="og:title" content="WhizSid | Portfolio & Blog" />
            <meta name="description" content="I am working as a software\
            engineer at Arimac. And also I am an undergraduate at SLIIT.\
            This is my personal website and the blog site.\
            You can check my latest blog posts and statuses with this website."/>
            <meta name="keywords" content="whizsid, rust, typescript, php, github,\
            laravel, rust, sri lanka, sliit, arimac, ceylon linux, nvision, masterbrand\
            matugama, colombo, meegahathanna, experienced, developer, software engineer,\
            salesforce, iot, docker" />
<meta property="og:type" content="website" />
<meta property="og:url" content={SITE_URL} />
    <meta property="og:image" content={SITE_URL + "img/opengraph.png"} />
                </Helmet>
                <Header homepage={true}/>
            <Breadcrumb />
            <RepositoriesSection />
            <BlogPostsSection />
            <SkillsSection />
            <Chatbox messages={[]} />
        </div>);
    }
}

export default HomePage;
