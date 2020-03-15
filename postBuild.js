const fs = require("fs");
const glob = require('glob');
const path = require('path');

const URL = "https://whizsid.github.io/";

fs.mkdirSync('./build/api/projects',{recursive: true});
fs.mkdirSync('./build/api/posts',{recursive: true});
fs.mkdirSync('./build/projects/',{recursive: true});
fs.mkdirSync('./build/blog/',{recursive: true});

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
                    blogs: []
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

            template = template.split("{{ keywords }}").join(project.keywords);

            fs.writeFileSync( path.join("./build/projects/",projectName+".html"),template);
        }

        
    }
 
});

glob("data/blog/**/*.md",(err,matches)=>{
    fs.mkdirSync('./build/api/posts/',{recursive: true});
    fs.mkdirSync('./build/posts/',{recursive: true});

    for( const match of matches){
        console.log(match);
    }
})