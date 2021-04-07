import * as React from "react";
import Chatbox from "../components/Chatbox";
import Header from "../components/Header";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import SkillsSection from "../components/HomePage/SkillsSection";

class HomePage extends React.Component {
    public render() {
        return (<div>
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
