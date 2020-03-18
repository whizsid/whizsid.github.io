import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL } from "./config";
import { SocialLink, Language, Project, Post } from "./types";

interface SuccessResponse {
    success: true;
    message?: string;
    [x: string]: any;
}

interface ErrorResponse {
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
