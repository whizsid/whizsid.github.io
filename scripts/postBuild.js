const { decode } = require("js-base64");
const axios = require("axios");
const fs = require("fs");

const GITHUB_ACCESS_TOKEN = decode(
    "Z2hwX1FCTDlnZUJUdDVuaXJuWWNqd29KREVSUGlMZ0xtUzJ6T1I5YQ=="
);
const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_REPOSITORY = "whizsid.github.io";
const GITHUB_PAGE = "https://whizsid.github.io/";
const GITHUB_OWNER = "whizsid";

const indexContent = fs.readFileSync("../build/index.html").toString();
const indexHeadEnd = indexContent.search("</head>");

if (!fs.existsSync("../build/blog")) {
    fs.mkdirSync("../build/blog");
}

// Search Page
const path = "../build/search.html";

let opengraphContents = `<meta property="og:title" content="WhizSid | Blog"/>`;
opengraphContents += `<meta name="description" property="og:description" content="Visit my blog site to search all blog posts related to programming" />`;
opengraphContents += `<meta property="keywords" content="${[
    "blog",
    "beginner",
    "advanced",
    "step by step",
    "php",
    "react",
    "laravel",
    "symfony",
    "rust",
].join(", ")}" />`;
opengraphContents += '<meta property="og:type" content="website"/>';
opengraphContents += `<meta property="fb:app_id" content="129537969147552"/>`;
imagePath = GITHUB_PAGE + "img/opengraph.png";
opengraphContents += `<meta property="og:image" content="${imagePath}"/>`;
opengraphContents += `<meta property="og:url" content="${
    GITHUB_PAGE + "search.html"
}"/>`;

if (fs.existsSync(path)) {
    fs.rmSync(path);
}

fs.writeFileSync(
    path,
    indexContent.substr(0, indexHeadEnd) +
        opengraphContents +
        indexContent.substr(indexHeadEnd + 7, indexContent.length)
);

// Index Page
const indexPath = "../build/index.html";

let indexOpengraphContents = `<meta property="og:title" content="WhizSid | Portfolio & Blog"/>`;
indexOpengraphContents += `<meta name="description" property="og:description" content="I am working as a software\
            engineer at Arimac. And also I am an undergraduate at SLIIT.\
            This is my personal website and the blog site.\
            You can check my latest blog posts and statuses with this website." />`;
indexOpengraphContents += `<meta property="keywords" content="whizsid, rust, typescript, php, github,\
            laravel, rust, sri lanka, sliit, arimac, ceylon linux, nvision, masterbrand\
            matugama, colombo, meegahathanna, experienced, developer, software engineer,\
            salesforce, iot, docker" />`;
indexOpengraphContents += '<meta property="og:type" content="website"/>';
indexOpengraphContents += `<meta property="fb:app_id" content="129537969147552"/>`;
imagePath = GITHUB_PAGE + "img/opengraph.png";
indexOpengraphContents += `<meta property="og:image" content="${imagePath}"/>`;
indexOpengraphContents += `<meta property="og:url" content="${
    GITHUB_PAGE
}"/>`;

if (fs.existsSync(indexPath)) {
    fs.rmSync(indexPath);
}

fs.writeFileSync(
    indexPath,
    indexContent.substr(0, indexHeadEnd) +
        indexOpengraphContents +
        indexContent.substr(indexHeadEnd + 7, indexContent.length)
);


async function fetchNextPage(page, cursor) {
    if (page != 1 && !cursor) {
        return;
    }
    return axios
        .post(
            GITHUB_API_URL,
            {
                query: `query {
                      repository(name:"${GITHUB_REPOSITORY}",owner:"${GITHUB_OWNER}"){
                         pullRequests(labels:"Post", first:100){
                          nodes {
                            title,
                            number,
                            createdAt,
                            updatedAt,
                            labels(first:100){
                              nodes {
                                name
                              }
                            }
                            bodyText,
                            files(first:100){
                              nodes {
                                path
                              }
                            }
                          },
                          pageInfo {
                            hasNextPage,
                            endCursor
                          }
                        }
                      }
                    }`,
            },
            {
                headers: {
                    Authorization: `bearer ${GITHUB_ACCESS_TOKEN}`,
                },
            }
        )
        .then((res) => {
            const pullRequests = res.data.data.repository.pullRequests;
            const endCursor = pullRequests.pageInfo.hasNextPage
                ? pullRequests.pageInfo.endCursor
                : null;

            for (let i = 0; i < pullRequests.nodes.length; i++) {
                createPage(pullRequests.nodes[i]);
            }

            return fetchNextPage(page + 1, endCursor);
        })
        .catch((res) => {
            throw res;
        });
}

fetchNextPage(1, null);

async function createPage(node) {
    if (!fs.existsSync("../build/blog/" + node.number)) {
        fs.mkdirSync("../build/blog/" + node.number);
    }

    const path =
        "../build/blog/" + node.number + "/" + titleToLink(node.title) + ".html";

    let opengraphContents = `<meta property="og:title" content="WhizSid| ${node.title}"/>`;
    opengraphContents += `<meta name="description" property="og:description" content="${node.bodyText}" />`;
    opengraphContents += `<meta property="keywords" content="${node.labels.nodes
        .map((nd) => nd.name.split(":").pop())
        .concat(["blog", "beginner", "advanced", "step by step"])
        .join(", ")}" />`;
    opengraphContents += '<meta property="og:type" content="article"/>';
    opengraphContents += `<meta property="og:article:published_time" content="${node.createdAt}"/>`;
    opengraphContents += `<meta property="og:article:modified_time" content="${node.updatedAt}"/>`;
    opengraphContents += `<meta name="author" content="Ramesh Kithsiri"/>`;
    opengraphContents += `<meta property="og:article:author:first_name" content="Ramesh"/>`;
    opengraphContents += `<meta property="og:article:author:last_name" content="Kithsiri"/>`;
    opengraphContents += `<meta property="og:article:author:username" content="whizsid"/>`;
    opengraphContents += `<meta property="fb:app_id" content="129537969147552"/>`;
    opengraphContents += `<meta property="og:article:section" content="Software Engineering"/>`;
    for (let i = 0; i < node.labels.nodes.length; i++) {
        opengraphContents += `<meta property="og:article:tag" content="${node.labels.nodes[
            i
        ].name
            .split(":")
            .pop()}"/>`;
    }
    let imagePath = node.files.nodes.filter(
        (f) => f.path.endsWith(".png") || f.path.endsWith(".jpg")
    )[0];
    if (!imagePath) {
        imagePath = GITHUB_PAGE + "img/opengraph.png";
    } else {
        imagePath = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/raw/src/${imagePath.path}`;
    }
    opengraphContents += `<meta property="og:image" content="${imagePath}"/>`;
    opengraphContents += `<meta property="og:url" content="${
        GITHUB_PAGE +
        "blog/" +
        node.number +
        "/" +
        titleToLink(node.title) +
        ".html"
    }"/>`;

    if (fs.existsSync(path)) {
        fs.rmSync(path);
    }

    fs.writeFileSync(
        path,
        indexContent.substr(0, indexHeadEnd) +
            opengraphContents +
            indexContent.substr(indexHeadEnd + 7, indexContent.length)
    );
}

function titleToLink(title) {
    return title.split(" ").join("-").toLowerCase();
}
