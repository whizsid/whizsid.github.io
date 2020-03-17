/** Please put common types in this file */

export interface SocialLink {
    name: string;
    icon: string;
    link: string;
}

export interface Language {
    id: string;
    name: string;
    logo: string;
    color: string;
    description: string;
}

export interface Project {
    title: string;
    description: string;
    image: string;
    repository: string;
    languages: string[];
    tags: string[];
    keywords: string;
}