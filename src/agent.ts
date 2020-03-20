import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL, APP_URL } from "./config";
import { Language, Post, Project, SocialLink } from "./types";

export interface SuccessResponse {
    success: true;
    message?: string;
    [x: string]: any;
}

export interface ErrorResponse {
    success: false;
    message?: string;
    [x: string]: any;
}

const request = <S extends SuccessResponse>(
    url: string,
    config: undefined | AxiosRequestConfig = undefined
) =>
    axios
        .get(API_URL + url + ".json" , config)
        .then(
            (response: AxiosResponse): S => ({
                success: true,
                ...response.data
            })
        )
        .catch(
            (err: AxiosError): ErrorResponse => ({
                message:
                    typeof err.response !== "undefined"
                        ? err.response.data.message
                        : "",
                success: false
            })
        );


export interface SocialLinkResponse extends SuccessResponse {
    links: SocialLink[];
}
export const getSocialLinks = ()=>request<SocialLinkResponse>("social");

export interface LanguagesResponse extends SuccessResponse {
    langs: Language[];
}
export const getLangs = ()=>request<LanguagesResponse>("langs");

export interface PinnedResponse extends SuccessResponse {
    projects: string[];
    posts: string[];
}
export const getPinned = ()=>request<PinnedResponse>("pinned");

export interface ProjectResponse extends Project {
    success: true;
    message?: string;
    [x: string]: any;
}
export const getProject = (projectName: string)=>request<ProjectResponse>("projects/"+projectName);

export interface PostResponse extends Post {
    success: true;
    message?: string;
    [x: string]: any;
}
export const getPost = (postName: string)=>request<PostResponse>("posts/"+postName);

export interface TimelineResponse extends SuccessResponse {
    dates: string[];
}
export const getTimeline = ()=>request<TimelineResponse>("timeline");

export interface PostsForMonthResponse extends SuccessResponse {
    posts: string[];
}
export const getPostsForMonth = (year: number, month: number)=> request<PostsForMonthResponse>(`timeline/${year}/${month.toString().padStart(2,"0")}`);

export interface ByCategoryResponse extends SuccessResponse {
    projects: string[];
    posts: string[];
}
export const getByLanguage = (langId: string)=> request<ByCategoryResponse>(`langs/${langId}`);
export const getByTag = (tagId: string)=> request<ByCategoryResponse>(`tags/${tagId}`);


export interface PostContentResponse extends SuccessResponse {
    content: string;
}
export const getPostContent = (
    postId: string
) =>
    axios
        .get(APP_URL + "posts/"+postId + ".md")
        .then(
            (response: AxiosResponse): PostContentResponse => ({
                success: true,
                content: response.data
            })
        )
        .catch(
            (err: AxiosError): ErrorResponse => ({
                message:
                    typeof err.response !== "undefined"
                        ? err.response.data.message
                        : "",
                success: false
            })
        );