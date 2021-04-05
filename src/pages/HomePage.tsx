import * as React from "react";
import Header from "../components/Header";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";
import SkillsSection from "../components/HomePage/SkillsSection";
import Chatbox from "../components/Chatbox";

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
