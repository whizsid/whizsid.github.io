import axios from "axios";
import fs from "fs";
import { decode } from "js-base64";
import showdown from "showdown";
import moment from "moment";

const GITHUB_ACCESS_TOKEN = decode(
    "Z2hwX1FCTDlnZUJUdDVuaXJuWWNqd29KREVSUGlMZ0xtUzJ6T1I5YQ=="
);
const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_REPOSITORY = "whizsid.github.io";
const GITHUB_PAGE = "https://whizsid.github.io/";
const GITHUB_OWNER = "whizsid";
const indexContent = fs.readFileSync("./build/index.html").toString();
const indexHeadEnd = indexContent.search("</head>");
const mdConverter = new showdown.Converter();
let sitemapContent =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
let rssContent = `<?xml version="1.0" encoding="utf-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
        <atom:link href="${GITHUB_PAGE}rss.xml" rel="self" type="application/rss+xml" />
        <title>WhizSid</title>
        <link>https://whizsid.github.io/</link>
        <description>Linux, Programming Blog (Typescript, React, C++, C, Matlab, PHP)</description>
        <language>en-us</language>
        <webMaster>whizsid@aol.com (Ramesh Kithsiri)</webMaster>
        <category>Technology</category>
        <category>Programming</category>
        <pubDate>${moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ")}</pubDate>`;

async function run() {
    if (!fs.existsSync("./build/blog")) {
        fs.mkdirSync("./build/blog");
    }

    // Search Page
    const path = "./build/search.html";

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
    let imagePath = GITHUB_PAGE + "img/opengraph.png";
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
    const indexPath = "./build/index.html";

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
    indexOpengraphContents += `<meta property="og:url" content="${GITHUB_PAGE}"/>`;

    if (fs.existsSync(indexPath)) {
        fs.rmSync(indexPath);
    }

    fs.writeFileSync(
        indexPath,
        indexContent.substr(0, indexHeadEnd) +
            indexOpengraphContents +
            indexContent.substr(indexHeadEnd + 7, indexContent.length)
    );

    await fetchNextPage(1, null);
    sitemapContent += "</urlset>";
    fs.writeFileSync("./build/sitemap.xml", sitemapContent);

    rssContent += "</channel></rss>";
    fs.writeFileSync("./build/rss.xml", rssContent);
}

async function fetchNextPage(
    page: number,
    cursor: null | string
): Promise<any> {
    if (page !== 1 && !cursor) {
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

interface ILabel {
    name: string;
}

interface IFile {
    path: string;
}

interface IPage {
    title: string;
    labels: {
        nodes: ILabel[];
    };
    createdAt: string;
    updatedAt: string;
    bodyText: string;
    files: {
        nodes: IFile[];
    };
    number: string;
}

async function createPage(node: IPage) {
    if (!fs.existsSync("./build/blog/" + node.number)) {
        fs.mkdirSync("./build/blog/" + node.number);
    }

    const path =
        "./build/blog/" +
        node.number +
        "/" +
        titleToLink(node.title) +
        ".html";

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
        (f) =>
            (f.path.endsWith(".png") || f.path.endsWith(".jpg")) &&
            f.path.substr(0, 12) === "blog/images/"
    )[0];
    if (!imagePath) {
        imagePath = { path: GITHUB_PAGE + "img/opengraph.png" };
    } else {
        imagePath = {
            path: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/raw/src/${imagePath.path}`,
        };
    }
    let blogPath = node.files.nodes
        .filter(
            (f) =>
                f.path.endsWith(".md") && f.path.substr(0, 11) === "blog/posts/"
        )
        .pop()?.path;
    blogPath = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/raw/src/${blogPath}`;
    opengraphContents += `<meta property="og:image" content="${imagePath.path}"/>`;
    opengraphContents += `<meta property="og:url" content="${
        GITHUB_PAGE +
        "blog/" +
        node.number +
        "/" +
        titleToLink(node.title) +
        ".html"
    }"/>`;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

    sitemapContent += `
       <url>

          <loc>${
              GITHUB_PAGE +
              "blog/" +
              node.number +
              "/" +
              titleToLink(node.title) +
              ".html"
          }</loc>

          <lastmod>${node.updatedAt.substr(0, 10)}</lastmod>

          <changefreq>never</changefreq>

          <priority>0.8</priority>

       </url>
    `;

    rssContent += `
       <item>
            <title>${node.title}</title>
            <link>${
                GITHUB_PAGE +
                "blog/" +
                node.number +
                "/" +
                titleToLink(node.title) +
                ".html"
            }</link>
            <description>${node.bodyText}</description>
            <guid>${
                GITHUB_PAGE +
                "blog/" +
                node.number +
                "/" +
                titleToLink(node.title) +
                ".html"
            }</guid>
              <pubDate>${moment(node.createdAt).format(
                  "ddd, DD MMM YYYY HH:mm:ss ZZ"
              )}</pubDate>
              ${node.labels.nodes.map(
                  (n) => "<category>" + n.name.split(":").pop() + "</category>"
              ).join("")}
              <comments>${
                  GITHUB_PAGE +
                  "blog/" +
                  node.number +
                  "/" +
                  titleToLink(node.title) +
                  ".html"
              }</comments>
       </item>
    `;

    const blogContentResponse = await axios.get(blogPath);
    const blogContent = blogContentResponse.data;
    const blogHtmlContent = mdConverter.makeHtml(blogContent);

    fs.writeFileSync(
        path,
        indexContent.substr(0, indexHeadEnd) +
            opengraphContents +
            indexContent
                .substr(indexHeadEnd + 7, indexContent.length)
                .replace(
                    '<div id="root"></div>',
                    `<div id="root">${blogHtmlContent}</div>`
                )
    );
}

function titleToLink(title: string) {
    return title.split(" ").join("-").toLowerCase();
}

run();
