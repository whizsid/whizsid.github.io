import { Err, isErr, None, Ok, Option, Result, Some } from "@hqoss/monads";
import axios, { AxiosError } from "axios";
import { default as moment, duration } from "moment";
import simpleicons from "simple-icons";
import {
    DEFAULT_POST_IMAGE,
    GITHUB_ACCESS_TOKEN,
    GITHUB_API_URL,
    GITHUB_OWNER,
    GITHUB_REPOSITORY,
} from "../config";
import { MATLAB_ICON } from "../icons";

interface UserRepositoryResponse {
    user: {
        repositories: {
            nodes: {
                name: string;
                description: string;
                forkCount: number;
                languages: {
                    nodes: {
                        color: string;
                        name: string;
                    }[];
                };
                repositoryTopics: {
                    nodes: {
                        topic: {
                            name: string;
                        };
                    }[];
                };
                stargazers: {
                    totalCount: number;
                };
            }[];
        };
    };
}

interface OrganizationRepositoryResponse {
    organization: UserRepositoryResponse["user"];
}

interface PullRequestNumberResponse {
    repository: {
        defaultBranchRef: {
            target: {
                history: {
                    nodes: {
                        associatedPullRequests: {
                            nodes: {
                                number: number;
                            }[];
                        };
                    }[];
                };
            };
        };
    };
}

interface PullRequest {
    id: string;
    number: number;
    title: string;
    bodyHTML: string;
    createdAt: string;
    merged: boolean;
    labels: {
        nodes: Label[];
    };
    files: {
        nodes: {
            path: string;
        }[];
    };
    mergeCommit: {
        oid: string;
    };
}

interface LabelCount extends Label {
    pullRequests: {
        totalCount: number;
    };
}

interface BlogPostsResponse {
    repository: {
        pullRequests: {
            nodes: PullRequest[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
}

interface BlogPostResponse {
    repository: {
        pullRequest: PullRequest;
    };
}

interface LabelResponse {
    repository: {
        labels: {
            nodes: LabelCount[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
}

interface SearchResponse {
    repository: {
        labels: {
            nodes: Label[];
        };
    };
    search: {
        issueCount: number;
        edges: {
            node: PullRequest;
        }[];
    };
}

interface RecommendedResponse {
    search: {
        edges: {
            node: PullRequest;
        }[];
    };
}

interface SearchPostsResponse {
    search: {
        issueCount: number;
        edges: {
            node: PullRequest;
        }[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
        };
    };
}

export interface SearchResult {
    posts: BlogPost[];
    tags: string[];
    languages: Language[];
}

export interface Language {
    color: string;
    name: string;
    iconPath: string;
}

export interface WithCount<T> {
    item: T;
    count: number;
}

export interface Repository {
    name: string;
    id: string;
    topics: string[];
    languages: Language[];
    description: string;
    starCount: number;
    forkCount: number;
}

export interface BlogPost {
    postPath: string;
    languages: Language[];
    title: string;
    imagePath: string;
    description: string;
    createdAt: string;
    tags: string[];
    id: string;
    example?: Example;
}

export interface Example {
    files: string[];
    name: string;
    commit: string;
}

export interface Label {
    name: string;
    color: string;
}

export const labelToLang = (label: Label): Language => {
    const langName = label.name.split(":").pop() as string;

    return {
        name: langName,
        color: label.color,
        iconPath: getLanguageIcon(langName.toLowerCase()),
    };
};

export const prToPost = (pr: PullRequest): BlogPost => {
    const exampleFiles = pr.files.nodes.filter((file) =>
        file.path.startsWith("blog/examples/")
    );

    let example;
    if (exampleFiles.length > 0) {
        const name = exampleFiles[0].path.split("/")[2];
        const files = exampleFiles.map((file) =>
            file.path.substr(15 + name.length)
        );
        const commit = pr.mergeCommit.oid;
        example = { name, files, commit };
    }

    return {
        id: pr.number.toString(),
        title: pr.title,
        postPath: (
            pr.files.nodes.find((path) => {
                if (
                    path.path.split(".").pop() === "md" &&
                    path.path.startsWith("blog/posts/")
                ) {
                    return true;
                }
                return false;
            }) as { path: string }
        ).path,
        imagePath: (
            pr.files.nodes.find((path) => {
                if (
                    (path.path.split(".").pop() === "jpg" ||
                        path.path.split(".").pop() === "png") &&
                    path.path.startsWith("blog/images/")
                ) {
                    return true;
                }
                return false;
            }) || { path: DEFAULT_POST_IMAGE }
        ).path,
        languages: pr.labels.nodes
            .filter((label) => {
                return label.name.split(":")[0] === "Language";
            })
            .map(labelToLang),
        description: pr.bodyHTML,
        createdAt: pr.createdAt,
        tags: pr.labels.nodes
            .filter((label) => {
                return label.name.split(":")[0] === "Tag";
            })
            .map((tag) => tag.name.split(":")[1]),
        example,
    };
};

const getLanguageIcon = (langName: string): string => {
    let iconName: string;

    switch (langName) {
        case "html":
            iconName = "html5";
            break;
        case "makefile":
            iconName = "cmake";
            break;
        case "dockerfile":
            iconName = "docker";
            break;
        case "shell":
            iconName = "gnubash";
            break;
        case "c++":
            iconName = "cplusplus";
            break;
        case "matlab":
            return MATLAB_ICON;
        default:
            iconName = langName;
            break;
    }

    const icon = simpleicons.get(iconName);

    if (typeof icon === "undefined") {
        return "";
    }

    return simpleicons.get(iconName).path;
};

export class Github {
    private static async call<T>(
        query: string
    ): Promise<Result<{ data: T }, AxiosError>> {
        return axios
            .post<{ data: T }>(
                GITHUB_API_URL,
                {
                    query,
                },
                {
                    headers: {
                        Authorization: `bearer ${GITHUB_ACCESS_TOKEN}`,
                    },
                }
            )
            .then((res) => {
                return Ok(res.data);
            })
            .catch((res) => {
                return Err(res);
            });
    }

    /**
     * Retrieving public repositories of the user and organizations
     */
    public static async repos(): Promise<Result<Repository[], AxiosError>> {
        let repositories: Repository[] = [];

        const userRepositoryResponse =
            await Github.call<UserRepositoryResponse>(
                'query { user(login:"' +
                    GITHUB_OWNER +
                    '"){ repositories (first:100){ nodes { name, stargazers { totalCount } forkCount, description, languages (first:3) { nodes { name, color } } repositoryTopics (first:10) { nodes { topic { name } } } } } } }'
            );

        if (isErr(userRepositoryResponse)) {
            return Promise.resolve(Err(userRepositoryResponse.unwrapErr()));
        } else {
            const userRepositories = userRepositoryResponse
                .unwrap()
                .data.user.repositories.nodes.filter(
                    (node) =>
                        !!node.repositoryTopics.nodes.find(
                            (topic) => topic.topic.name === "pinned"
                        )
                )
                .map((node) => ({
                    name: node.name,
                    description: node.description,
                    topics: node.repositoryTopics.nodes
                        .filter((node2) => node2.topic.name !== "pinned")
                        .map((node2) => node2.topic.name),
                    languages: node.languages.nodes.map(labelToLang),
                    forkCount: node.forkCount,
                    starCount: node.stargazers.totalCount,
                    id: "whizsid/" + node.name,
                }));

            repositories = repositories.concat(userRepositories);
        }

        const orgRepositoryResponse =
            await Github.call<OrganizationRepositoryResponse>(
                'query { organization(login:"FreeReacts"){ repositories (first:100){ nodes { name, stargazers { totalCount } forkCount, description, languages (first:3) { nodes { name, color } } repositoryTopics (first:10) { nodes { topic { name } } } } } } }'
            );

        if (isErr(orgRepositoryResponse)) {
            return Promise.resolve(Err(orgRepositoryResponse.unwrapErr()));
        } else {
            const orgRepositories = orgRepositoryResponse
                .unwrap()
                .data.organization.repositories.nodes.filter(
                    (node) =>
                        !!node.repositoryTopics.nodes.find(
                            (topic) => topic.topic.name === "pinned"
                        )
                )
                .map((node) => ({
                    name: node.name,
                    description: node.description,
                    topics: node.repositoryTopics.nodes
                        .filter((node2) => node2.topic.name !== "pinned")
                        .map((node2) => node2.topic.name),
                    languages: node.languages.nodes.map(labelToLang),
                    forkCount: node.forkCount,
                    starCount: node.stargazers.totalCount,
                    id: "FreeReacts/" + node.name,
                }));

            repositories = repositories.concat(orgRepositories);
        }

        return Promise.resolve(Ok(repositories));
    }

    /**
     * Retreiving blog posts by pull requests
     *
     * @param endCursor Cursor id
     */
    public static async blogPosts(
        endCursor: Option<string>,
        filters: string[],
        limit: number
    ): Promise<
        Result<{ posts: BlogPost[]; cursor: Option<string> }, AxiosError>
    > {
        const afterText = endCursor.isSome()
            ? `, after:"${endCursor.unwrap()}"`
            : "";
        filters.push("Post");

        const blogPostResponse = await Github.call<BlogPostsResponse>(`query {
            repository(name: "${GITHUB_REPOSITORY}", owner:"${GITHUB_OWNER}"){
                pullRequests( first:${limit}${afterText}, labels:[${filters
            .map((l) => '"' + l + '"')
            .join(",")}], states: [MERGED], orderBy: {field: CREATED_AT, direction: DESC}){
                    nodes {
                        id,
                        number,
                        title,
                        bodyHTML,
                        createdAt,
                        mergeCommit{
                            oid
                        },
                        files(last:100){
                            nodes {
                                path
                            }
                        },
                        labels(last:100){
                            nodes {
                                name,
                                color
                            }
                        }
                    },
                    pageInfo {
                        hasNextPage,
                        endCursor
                    }
                }
            }
        }`);

        return Promise.resolve(
            blogPostResponse.map((data) => ({
                posts: data.data.repository.pullRequests.nodes.map(prToPost),
                cursor: data.data.repository.pullRequests.pageInfo.hasNextPage
                    ? Some(data.data.repository.pullRequests.pageInfo.endCursor)
                    : None,
            }))
        );
    }

    /**
     * Retreiving a single blog post
     *
     * @param id PR number
     */
    public static async blogPost(
        id: number
    ): Promise<Result<BlogPost, AxiosError>> {
        const blogPostResponse = await Github.call<BlogPostResponse>(`query {
            repository(name: "${GITHUB_REPOSITORY}", owner:"${GITHUB_OWNER}"){
                pullRequest(number: ${id} ){
                    id,
                    number,
                    title,
                    bodyHTML,
                    createdAt,
                    mergeCommit{
                        oid
                    },
                    files(last:100){
                        nodes {
                            path
                        }
                    },
                    labels(last:100){
                        nodes {
                            name,
                            color
                        }
                    }
                }
            }
        }`);

        return Promise.resolve(
            blogPostResponse.map(
                ({
                    data: {
                        repository: { pullRequest },
                    },
                }) => prToPost(pullRequest)
            )
        );
    }

    /**
     * Searching for blog posts and tags, languages
     *
     * @param keyword
     * @param limit
     * @param labels
     * @param labelJoinMethod "AND"|"OR"
     */
    public static async search(
        keyword: string,
        limit: number,
        labels: string[]
    ): Promise<Result<SearchResult, AxiosError>> {
        const blogPostResponse = await Github.call<SearchResponse>(`query{
            search(
                query: "is:merged is:pr is:public archived:false author:whizsid user:whizsid label:Post sort:created-desc ${labels
                    .map((label) => "label:" + label)
                    .join(" ")} repo:whizsid.github.io ${keyword}",
                type: ISSUE,
                first: ${limit}
            ) {
                issueCount,
                edges {
                    node {
                        ... on PullRequest {
                            id,
                            number,
                            title,
                            bodyHTML,
                            createdAt,
                            files(last:100){
                                nodes {
                                    path
                                }
                            },
                            mergeCommit{
                                oid
                            },
                            labels(last:100){
                                nodes {
                                    name,
                                    color
                                }
                            }
                        }
                    }
                }
            }
            repository(name: "${GITHUB_REPOSITORY}", owner: "${GITHUB_OWNER}"){
                labels(first: ${limit}, query: "${keyword}"){
                    nodes {
                        name,
                        color
                    }
                }
            }
        }`);

        return Promise.resolve(
            blogPostResponse.map((data) => ({
                posts: data.data.search.edges.map((pr) => prToPost(pr.node)),
                languages: data.data.repository.labels.nodes
                    .filter((label) => {
                        return label.name.split(":")[0] === "Language";
                    })
                    .map(labelToLang),
                tags: data.data.repository.labels.nodes
                    .filter((label) => {
                        return label.name.split(":")[0] === "Tag";
                    })
                    .map((tag) => tag.name.split(":")[1]),
            }))
        );
    }

    /**
     * Searching for blog posts
     *
     * @param keyword
     * @param limit
     * @param labels
     * @param labelJoinMethod "AND"|"OR"
     */
    public static async searchPosts(
        limit: number,
        labels: string[],
        keyword: Option<string>,
        cursor: Option<string>
    ): Promise<
        Result<{ posts: BlogPost[]; cursor: Option<string> }, AxiosError>
    > {
        const afterText = cursor.isSome() ? `, after:"${cursor.unwrap()}"` : "";
        const keywordText = keyword?.unwrapOr("");
        const blogPostResponse = await Github.call<SearchPostsResponse>(`query{
            search(
                query: "is:merged is:pr is:public archived:false author:whizsid user:whizsid label:Post ${labels
                    .map((label) => "label:" + label)
                    .join(" ")} repo:whizsid.github.io ${keywordText}",
                type: ISSUE,
                first: ${limit}
                ${afterText}
            ) {
                issueCount,
                    pageInfo {
                        hasNextPage,
                        endCursor
                    },
                edges {
                    node {
                        ... on PullRequest {
                            id,
                            number,
                            title,
                            bodyHTML,
                            createdAt,
                            files(last:100){
                                nodes {
                                    path
                                }
                            },
                            mergeCommit{
                                oid
                            },
                            labels(last:100){
                                nodes {
                                    name,
                                    color
                                }
                            }
                        }
                    }
                }
            }
        }`);

        return Promise.resolve(
            blogPostResponse.map((data) => ({
                posts: data.data.search.edges.map((pr) => prToPost(pr.node)),
                cursor: data.data.search.pageInfo.hasNextPage
                    ? Some(data.data.search.pageInfo.endCursor)
                    : None,
            }))
        );
    }

    /**
     * Returning the recommending posts for a one post viewer
     *
     * @param post
     */
    public static async getRecommended(
        post: BlogPost,
        label?: string
    ): Promise<Result<BlogPost[], AxiosError>> {
        const prTime = moment(post.createdAt);
        const now = moment();

        const diff = duration(now.diff(prTime));
        let to = moment();
        let from = moment().subtract(1, "year");
        if (diff.years() > 0) {
            to = prTime.add(6, "month");
            from = prTime.subtract(6, "month");
        }

        const formattedLabel = label ? " label:" + label : "";

        const response = await Github.call<RecommendedResponse>(`query{
            search(
                query: "is:merged is:pr is:public archived:false author:${GITHUB_OWNER} user:${GITHUB_OWNER} label:Post ${formattedLabel} repo:${GITHUB_REPOSITORY} created:>${from.format(
            "YYYY-MM-DD"
        )} created:<${to.format("YYYY-MM-DD")} ",
                type: ISSUE,
                first: 20
            ) {
                issueCount,
                edges {
                    node {
                        ... on PullRequest {
                            id,
                            number,
                            title,
                            bodyHTML,
                            createdAt,
                            files(last:100){
                                nodes {
                                    path
                                }
                            },
                            mergeCommit{
                                oid
                            },
                            labels(last:100){
                                nodes {
                                    name,
                                    color
                                }
                            }
                        }
                    }
                }
            }
        }`);

        return Promise.resolve(
            response.map((data) =>
                data.data.search.edges.map((edge) => prToPost(edge.node))
            )
        );
    }

    /**
     * Returning the pull request number by blog post path
     *
     * @param filePath
     */
    public static async getPullRequestNumber(
        filePath: string
    ): Promise<Result<number, AxiosError>> {
        const response = await Github.call<PullRequestNumberResponse>(
            `{ repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPOSITORY}") { defaultBranchRef{ target { ...on Commit{ history(first:100,path: "${filePath}"){ nodes { associatedPullRequests (first:100){ nodes { number } } } } } } } }}`
        );

        return Promise.resolve(
            response.map(
                (res) =>
                    res.data.repository.defaultBranchRef.target.history.nodes[0]
                        .associatedPullRequests.nodes[0].number
            )
        );
    }

    /**
     * Returning all labels for a given query string
     *
     * @param keyword
     */
    public static async searchLabels(
        keyword: Option<string>,
        endCursor: Option<string>,
        limit: number
    ): Promise<
        Result<{ labels: LabelCount[]; cursor: Option<string> }, AxiosError>
    > {
        let afterText = endCursor.isSome()
            ? `, after:"${endCursor.unwrap()}"`
            : "";
        if (keyword.isSome()) {
            afterText += `, query: "${keyword.unwrap()}"`;
        }

        const labelResponse = await Github.call<LabelResponse>(`query {
            repository(name: "${GITHUB_REPOSITORY}", owner:"${GITHUB_OWNER}"){
                labels ( first:${limit}${afterText}, orderBy:{field:NAME, direction:ASC}){
                    nodes {
                        name,
                        color,
                        pullRequests(first:0){
                            totalCount
                        }
                    },
                    pageInfo {
                        hasNextPage,
                        endCursor
                    }
                }
            }
        }`);

        return Promise.resolve(
            labelResponse.map((data) => ({
                labels: data.data.repository.labels.nodes.map((label) => label),
                cursor: data.data.repository.labels.pageInfo.hasNextPage
                    ? Some(data.data.repository.labels.pageInfo.endCursor)
                    : None,
            }))
        );
    }
}
