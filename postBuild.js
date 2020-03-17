const fs = require("fs");
const glob = require('glob');
const path = require('path');
const ini = require('ini');

const URL = "https://whizsid.github.io/";

fs.rmdirSync('./build/api',{recursive: true});
fs.rmdirSync('./build/projects',{recursive: true});
fs.rmdirSync('./build/blog',{recursive: true});
fs.rmdirSync('./build/posts',{recursive: true});

fs.mkdirSync('./build/api/projects',{recursive: true});
fs.mkdirSync('./build/api/posts',{recursive: true});
fs.mkdirSync('./build/api/timeline',{recursive: true});
fs.mkdirSync('./build/projects/',{recursive: true});
fs.mkdirSync('./build/blog/',{recursive: true});
fs.mkdirSync('./build/posts/',{recursive: true});
fs.writeFileSync('./build/api/timeline.json',JSON.stringify({
    success: true,
    dates: []
}));

fs.copyFileSync('./data/social.json','./build/api/social.json');
fs.copyFileSync('./data/pinned.json','./build/api/pinned.json');
fs.copyFileSync('./data/langs.json','./build/api/langs.json');

const categories = [
    {json: "languages",name: "langs"},
    {json: "tags",name: "tags"},
];

glob("data/projects/*.json",(err,matches)=>{

    for(const match of matches){

        const projectName = path.basename(match,'.json');

        const content = fs.readFileSync(match);

        const project = JSON.parse(content);

        fs.writeFileSync(path.join('./build/api/projects',projectName+'.json'), content);

        for (const cat of categories){

            for (const name of project[cat.json]){

                let catBased = {
                    success: true,
                    projects: [],
                    posts: []
                };

                const catProjectsPath = path.join('./build/api/',cat.name,name+'.json');

                if(fs.existsSync(catProjectsPath)){
                    const catProjectsContent = fs.readFileSync(catProjectsPath);

                    catBased = JSON.parse(catProjectsContent);
                }

                if(!catBased.projects.includes(projectName))
                    catBased.projects.push(projectName);

                fs.mkdirSync('./build/api/'+cat.name,{recursive: true});

                fs.writeFileSync(catProjectsPath,JSON.stringify(catBased));

            }
        }

        if(fs.existsSync('./build/index.html')){
            let template = fs.readFileSync('./build/index.html').toString();

            template = template.split("{{ title }}").join( project.title);
            template = template.split("{{ description }}").join(project.description);
            if(project.image){
                template = template.split("{{ image }}").join(URL+project.image);
            } else {
                template = template.split("{{ image }}").join("img/opengraph.png");
            }

            template = template.split("{{ url }}").join(URL + 'projects/' + projectName + '.html');

            template = template.split("{{ keywords }}").join(project.keywords);

            fs.writeFileSync( path.join("./build/projects/",projectName+".html"),template);
        }

        
    }
 
});

glob("data/blog/**/*.md",(err,matches)=>{

    for( const match of matches){
        const content = fs.readFileSync(match).toString();

        let exploded = content.split('```');

        exploded.pop();

        let config = exploded.pop();
        if(config.startsWith('ini')){
            config = config.substr(4);
        }

        const postContent = exploded.join('```');

        const parsedConfig = ini.parse(config);

        const postName = match.substr(10,match.length-13).split('/').join('-');

        const post = {
            title: parsedConfig.title,
            description: parsedConfig.description,
            image: parsedConfig.image,
            languages: parsedConfig.languages.split(','),
            tags:parsedConfig.tags.split(','),
            keywords: parsedConfig.keywords,
            success: true,
            date: parsedConfig.date
        }

        fs.writeFileSync(path.join('./build/api/posts',postName+'.json'), JSON.stringify(post));

        for (const cat of categories){

            for (const name of post[cat.json]){

                let catBased = {
                    success: true,
                    projects: [],
                    posts: []
                };

                const catPostsPath = path.join('./build/api/',cat.name,name+'.json');

                if(fs.existsSync(catPostsPath)){
                    const catPostsContent = fs.readFileSync(catPostsPath);

                    catBased = JSON.parse(catPostsContent);
                }

                if(!catBased.posts.includes(postName))
                    catBased.posts.push(postName);

                fs.mkdirSync('./build/api/'+cat.name,{recursive: true});

                fs.writeFileSync(catPostsPath,JSON.stringify(catBased));

            }
        }

        fs.writeFileSync(path.join('./build/posts',postName+'.md'),postContent);

        const date = post.date.split('-');

        fs.mkdirSync(path.join('./build/api/timeline/',date[0]),{recursive: true});

        let datePosts = {
            success: true,
            posts: []
        };

        const jsonPath = path.join('./build/api/timeline',date[0],date[1]+'.json');

        if(fs.existsSync(jsonPath)){
            datePosts = JSON.parse(fs.readFileSync(jsonPath).toString());
        }

        datePosts.posts.push(postName);

        fs.writeFileSync(jsonPath,JSON.stringify(datePosts));

        const timeline = JSON.parse(fs.readFileSync('./build/api/timeline.json').toString());

        if(!timeline.dates.includes(post.date)){
            timeline.dates.push(post.date);
        }

        fs.writeFileSync('./build/api/timeline.json',JSON.stringify(timeline));

        if(fs.existsSync('./build/index.html')){
            let template = fs.readFileSync('./build/index.html').toString();

            template = template.split("{{ title }}").join( post.title);
            template = template.split("{{ description }}").join(post.description);
            if(post.image){
                template = template.split("{{ image }}").join(URL+post.image);
            } else {
                template = template.split("{{ image }}").join("img/opengraph.png");
            }

            template = template.split("{{ url }}").join(URL + 'blog/' + postName + '.html');

            template = template.split("{{ keywords }}").join(post.keywords);

            fs.writeFileSync( path.join("./build/blog/",postName+".html"),template);
        }
    }
})

if(fs.existsSync('./build/index.html')){
    let template = fs.readFileSync('./build/index.html').toString();

    template = template.split("{{ title }}").join( "Portfolio and Blog Of WhizSid");
    template = template.split("{{ description }}").join("Visit to see WhizSid's projects and blog posts.");

    template = template.split("{{ image }}").join("img/opengraph.png");

    template = template.split("{{ url }}").join(URL + 'projects/index.html');

    template = template.split("{{ keywords }}").join("WhizSid,Technology,IT,Laravel,React,Frontend,JavaScript,NodeJS,Tutorial,Web Design,Web Developing,Sinhala,English");

    fs.writeFileSync( path.join("./build/index.html"),template);
}