import { FC, useEffect, useState } from "react";
import { BlogPost, Github } from "../../agents/Github";
import RecommendedCard from "./RecommendedCard";
import RecommendedCardPlaceholder from "./RecommendedCardPlaceholder";

interface IRecommendedProps {
    post: BlogPost;
}

const Recommended: FC<IRecommendedProps> = ({ post }: IRecommendedProps) => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([] as BlogPost[]);

    useEffect(() => {
        Github.getRecommended(post)
            .then((result) => {
                setLoading(false);
                if (result.isOk()) {
                    setPosts(result.unwrap());
                }
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            {loading && [
                <RecommendedCardPlaceholder key={0} />,
                <RecommendedCardPlaceholder key={1} />,
            ]}
            {!loading &&
                posts.map((p, i) => <RecommendedCard key={i} post={p} />)}
        </div>
    );
};

export default Recommended;
