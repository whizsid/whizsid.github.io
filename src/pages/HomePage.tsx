import * as React from "react";
import Header from "../components/Header";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";

class HomePage extends React.Component {
    public render(){
        return (<div>
            <Header/>
            <Breadcrumb/>
            <RepositoriesSection/>
            <BlogPostsSection/>
        </div>);
    }
}

export default HomePage;