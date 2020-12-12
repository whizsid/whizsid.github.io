import { Err, isErr, None, Ok, Option, Result, Some } from "@hqoss/monads";
import axios, { AxiosError } from "axios";
import simpleicons from "simple-icons";
import { DEFAULT_POST_IMAGE, GITHUB_ACCESS_TOKEN, GITHUB_API_URL, GITHUB_REPOSITORY, GITHUB_OWNER } from "../config";

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
                    }[]
                };
                repositoryTopics: {
                    nodes: {
                        topic: {
                            name: string
                        }
                    }[]
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
                            }[]
                        }
                    }[]
                }
            }
        }
    };
}

interface BlogPostResponse {
    repository: {
        pullRequests: {
            nodes: {
                title: string;
                bodyHTML: string;
                createdAt: string;
                merged: boolean;
                labels: {
                    nodes: {
                        name: string;
                    }[]
                };
                files: {
                    nodes: {
                        path: string;
                    }[]
                }
            }[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string
            }
        };
    };
}

export interface Repository {
    name: string;
    id: string;
    topics: string[];
    languages: {
        color: string;
        name: string;
        iconPath: string;
    }[];
    description: string;
    starCount: number;
    forkCount: number;
}

export interface BlogPost {
    postPath: string;
    languages: string[];
    title: string;
    imagePath: string;
    description: string;
    createdAt: string;
    tags: string[];
}

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
    private static async call<T>(query: string): Promise<Result<{ data: T }, AxiosError>> {
        return axios.post<{ data: T }>(GITHUB_API_URL, {
            query
        }, {
            headers: {
                "Authorization": `bearer ${GITHUB_ACCESS_TOKEN}`
            }
        }).then(res => {
            return Ok(res.data);
        }).catch(res => {
            return Err(res);
        });
    }

    /**
     * Retrieving public repositories of the user and organizations
     */
    public static async repos(): Promise<Result<Repository[], AxiosError>> {
        let repositories: Repository[] = [];

        const userRepositoryResponse = await Github.call<UserRepositoryResponse>("query { user(login:\""+GITHUB_OWNER+"\"){ repositories (first:100){ nodes { name, stargazers { totalCount } forkCount, description, languages (first:3) { nodes { name, color } } repositoryTopics (first:10) { nodes { topic { name } } } } } } }");

        if (isErr(userRepositoryResponse)) {
            return Promise.resolve(Err(userRepositoryResponse.unwrapErr()));
        } else {
            const userRepositories = userRepositoryResponse.unwrap().data.user.repositories.nodes
                .filter(node => !!node.repositoryTopics.nodes.find(topic => topic.topic.name === "pinned"))
                .map(node => ({
                    name: node.name,
                    description: node.description,
                    topics: node.repositoryTopics.nodes.filter(node2 => node2.topic.name !== "pinned").map(node2 => node2.topic.name),
                    languages: node.languages.nodes.map(node2 => ({
                        name: node2.name,
                        color: node2.color,
                        iconPath: getLanguageIcon(node2.name.toLowerCase())
                    })),
                    forkCount: node.forkCount,
                    starCount: node.stargazers.totalCount,
                    id: "whizsid/" + node.name
                }));

            repositories = repositories.concat(userRepositories);
        }

        const orgRepositoryResponse = await Github.call<OrganizationRepositoryResponse>("query { organization(login:\"FreeReacts\"){ repositories (first:100){ nodes { name, stargazers { totalCount } forkCount, description, languages (first:3) { nodes { name, color } } repositoryTopics (first:10) { nodes { topic { name } } } } } } }");

        if (isErr(orgRepositoryResponse)) {
            return Promise.resolve(Err(orgRepositoryResponse.unwrapErr()));
        } else {
            const orgRepositories = orgRepositoryResponse.unwrap().data.organization.repositories.nodes
                .filter(node => !!node.repositoryTopics.nodes.find(topic => topic.topic.name === "pinned"))
                .map(node => ({
                    name: node.name,
                    description: node.description,
                    topics: node.repositoryTopics.nodes.filter(node2 => node2.topic.name !== "pinned").map(node2 => node2.topic.name),
                    languages: node.languages.nodes.map(node2 => ({
                        name: node2.name,
                        color: node2.color,
                        iconPath: getLanguageIcon(node2.name.toLowerCase())
                    })),
                    forkCount: node.forkCount,
                    starCount: node.stargazers.totalCount,
                    id: "FreeReacts/" + node.name
                }
                ));

            repositories = repositories.concat(orgRepositories);
        }

        return Promise.resolve(Ok(repositories));

    }

    /**
     * Retreiving blog posts by pull requests
     *
     * @param endCursor Cursor id
     */
    public static async blogPosts(endCursor: Option<string>, filters: string[]): Promise<Result<{ posts: BlogPost[], cursor: Option<string> }, AxiosError>> {
        const afterText = endCursor.isSome() ? `, after:"${endCursor.unwrap()}"` : "";
        filters.push("post");

        const blogPostResponse = await Github.call<BlogPostResponse>(`query { repository(name: "${GITHUB_REPOSITORY}", owner:"${GITHUB_OWNER}"){ pullRequests( first:100${afterText}, labels:[${filters.map(l=>"\""+l+"\"").join(",")}]){ nodes { id, title, bodyHTML, createdAt, labels(last:100){ nodes { name } } }, pageInfo {hasNextPage, endCursor} } } }`);

        return Promise.resolve(blogPostResponse.map(data => ({
            posts: (data.data.repository.pullRequests.nodes.filter(pr => {
                return !!pr.labels.nodes.find(label => label.name === "blog-post") && pr.merged;
            }).map(pr => ({
                title: pr.title,
                postPath: (pr.files.nodes.find((path) => {
                    if (path.path.split(".").pop() === "md") {
                        return true;
                    }
                    return false;
                }) as { path: string }).path,
                imagePath: (pr.files.nodes.find((path) => {
                    if (path.path.split(".").pop() === "jpg" || path.path.split(".").pop()==="png") {
                        return true;
                    }
                    return false;
                }) || { path: DEFAULT_POST_IMAGE }).path,
                languages: pr.labels.nodes.filter(label => {
                    return label.name.split(":")[0] === "Language";
                }).map(lang => lang.name.split(":")[1]),
                description: pr.bodyHTML,
                createdAt: pr.createdAt,
                tags: pr.labels.nodes.filter(label => {
                    return label.name.split(":")[0] === "Tag";
                }).map(tag => tag.name.split(":")[1])
            }))),
            cursor: data.data.repository.pullRequests.pageInfo.hasNextPage ?
                Some(data.data.repository.pullRequests.pageInfo.endCursor) :
                None
        })));
    }

    /**
     * Returning the pull request number by blog post path
     * 
     * @param filePath
     */
    public static async getPullRequestNumber(filePath: string): Promise<Result<number, AxiosError>> {
        const response = await Github.call<PullRequestNumberResponse>(`{ repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPOSITORY}") { defaultBranchRef{ target { ...on Commit{ history(first:100,path: "${filePath}"){ nodes { associatedPullRequests (first:100){ nodes { number } } } } } } } }}`);

        return Promise.resolve(response.map(res => res.data.repository.defaultBranchRef.target.history.nodes[0].associatedPullRequests.nodes[0].number));
    }
}