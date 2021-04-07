import * as React from "react";
import { BlogPost, Github } from "../../agents/Github";
import RecommendedCard from "./RecommendedCard";
import RecommendedCardPlaceholder from "./RecommendedCardPlaceholder";

interface RecommendedProps {
    post: BlogPost;
}

interface RecommendedState {
    loading: boolean;
    posts: BlogPost[];
}

class Recommended extends React.Component<RecommendedProps, RecommendedState> {
    constructor(props:RecommendedProps){
        super(props);

        this.state = {
            loading: true,
            posts: []
        };

        Github.getRecommended(props.post).then(result=>{
            if(result.isOk()){
                this.setState({
                    loading: false,
                    posts: result.unwrap()
                });
            } else {
                this.setState({loading: false});
            }
        }).catch(e=>this.setState({loading: false}));

    }

    public render() {
        const {loading, posts} = this.state;

        return <div>
        {loading&&([
            <RecommendedCardPlaceholder key={0} />,
            <RecommendedCardPlaceholder key={1} />,
        ])}
            {!loading&&posts.map((p,i)=>(
                <RecommendedCard key={i} post={p} />
            ))

        }
        </div>;
    }
}

export default Recommended;
