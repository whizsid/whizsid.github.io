"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var js_base64_1 = require("js-base64");
var showdown_1 = __importDefault(require("showdown"));
var moment_1 = __importDefault(require("moment"));
var GITHUB_ACCESS_TOKEN = (0, js_base64_1.decode)("Z2hwX1FCTDlnZUJUdDVuaXJuWWNqd29KREVSUGlMZ0xtUzJ6T1I5YQ==");
var GITHUB_API_URL = "https://api.github.com/graphql";
var GITHUB_REPOSITORY = "whizsid.github.io";
var GITHUB_PAGE = "https://whizsid.github.io/";
var GITHUB_OWNER = "whizsid";
var indexContent = fs_1.default.readFileSync("../build/index.html").toString();
var indexHeadEnd = indexContent.search("</head>");
var mdConverter = new showdown_1.default.Converter();
var sitemapContent = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
var rssContent = "<?xml version=\"1.0\" encoding=\"utf-8\"?><rss version=\"2.0\"><channel><title>WhizSid</title>\n        <link>https://whizsid.github.io/</link>\n        <description>Linux, Programming Blog (Typescript, React, C++, C, Matlab, PHP)</description>\n        <language>en-us</language>\n        <webMaster>whizsid@aol.com (Ramesh Kithsiri)</webMaster>\n        <image>https://avatars.githubusercontent.com/u/44908250?v=4</image>\n        <category>Technology</category>\n        <category>Programming</category>\n        <pubDate>" + (0, moment_1.default)().format("ddd, DD MMM YYYY HH:mm:ss ZZ") + "</pubDate>";
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var path, opengraphContents, imagePath, indexPath, indexOpengraphContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs_1.default.existsSync("../build/blog")) {
                        fs_1.default.mkdirSync("../build/blog");
                    }
                    path = "../build/search.html";
                    opengraphContents = "<meta property=\"og:title\" content=\"WhizSid | Blog\"/>";
                    opengraphContents += "<meta name=\"description\" property=\"og:description\" content=\"Visit my blog site to search all blog posts related to programming\" />";
                    opengraphContents += "<meta property=\"keywords\" content=\"" + [
                        "blog",
                        "beginner",
                        "advanced",
                        "step by step",
                        "php",
                        "react",
                        "laravel",
                        "symfony",
                        "rust",
                    ].join(", ") + "\" />";
                    opengraphContents += '<meta property="og:type" content="website"/>';
                    opengraphContents += "<meta property=\"fb:app_id\" content=\"129537969147552\"/>";
                    imagePath = GITHUB_PAGE + "img/opengraph.png";
                    opengraphContents += "<meta property=\"og:image\" content=\"" + imagePath + "\"/>";
                    opengraphContents += "<meta property=\"og:url\" content=\"" + (GITHUB_PAGE + "search.html") + "\"/>";
                    if (fs_1.default.existsSync(path)) {
                        fs_1.default.rmSync(path);
                    }
                    fs_1.default.writeFileSync(path, indexContent.substr(0, indexHeadEnd) +
                        opengraphContents +
                        indexContent.substr(indexHeadEnd + 7, indexContent.length));
                    indexPath = "../build/index.html";
                    indexOpengraphContents = "<meta property=\"og:title\" content=\"WhizSid | Portfolio & Blog\"/>";
                    indexOpengraphContents += "<meta name=\"description\" property=\"og:description\" content=\"I am working as a software            engineer at Arimac. And also I am an undergraduate at SLIIT.            This is my personal website and the blog site.            You can check my latest blog posts and statuses with this website.\" />";
                    indexOpengraphContents += "<meta property=\"keywords\" content=\"whizsid, rust, typescript, php, github,            laravel, rust, sri lanka, sliit, arimac, ceylon linux, nvision, masterbrand            matugama, colombo, meegahathanna, experienced, developer, software engineer,            salesforce, iot, docker\" />";
                    indexOpengraphContents += '<meta property="og:type" content="website"/>';
                    indexOpengraphContents += "<meta property=\"fb:app_id\" content=\"129537969147552\"/>";
                    imagePath = GITHUB_PAGE + "img/opengraph.png";
                    indexOpengraphContents += "<meta property=\"og:image\" content=\"" + imagePath + "\"/>";
                    indexOpengraphContents += "<meta property=\"og:url\" content=\"" + GITHUB_PAGE + "\"/>";
                    if (fs_1.default.existsSync(indexPath)) {
                        fs_1.default.rmSync(indexPath);
                    }
                    fs_1.default.writeFileSync(indexPath, indexContent.substr(0, indexHeadEnd) +
                        indexOpengraphContents +
                        indexContent.substr(indexHeadEnd + 7, indexContent.length));
                    return [4 /*yield*/, fetchNextPage(1, null)];
                case 1:
                    _a.sent();
                    sitemapContent += "</urlset>";
                    fs_1.default.writeFileSync("../build/sitemap.xml", sitemapContent);
                    rssContent += "</channel></rss>";
                    fs_1.default.writeFileSync("../build/rss.xml", rssContent);
                    return [2 /*return*/];
            }
        });
    });
}
function fetchNextPage(page, cursor) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (page !== 1 && !cursor) {
                return [2 /*return*/];
            }
            return [2 /*return*/, axios_1.default
                    .post(GITHUB_API_URL, {
                    query: "query {\n                      repository(name:\"" + GITHUB_REPOSITORY + "\",owner:\"" + GITHUB_OWNER + "\"){\n                         pullRequests(labels:\"Post\", first:100){\n                          nodes {\n                            title,\n                            number,\n                            createdAt,\n                            updatedAt,\n                            labels(first:100){\n                              nodes {\n                                name\n                              }\n                            }\n                            bodyText,\n                            files(first:100){\n                              nodes {\n                                path\n                              }\n                            }\n                          },\n                          pageInfo {\n                            hasNextPage,\n                            endCursor\n                          }\n                        }\n                      }\n                    }",
                }, {
                    headers: {
                        Authorization: "bearer " + GITHUB_ACCESS_TOKEN,
                    },
                })
                    .then(function (res) {
                    var pullRequests = res.data.data.repository.pullRequests;
                    var endCursor = pullRequests.pageInfo.hasNextPage
                        ? pullRequests.pageInfo.endCursor
                        : null;
                    for (var i = 0; i < pullRequests.nodes.length; i++) {
                        createPage(pullRequests.nodes[i]);
                    }
                    return fetchNextPage(page + 1, endCursor);
                })
                    .catch(function (res) {
                    throw res;
                })];
        });
    });
}
function createPage(node) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var path, opengraphContents, i, imagePath, blogPath, blogContentResponse, blogContent, blogHtmlContent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!fs_1.default.existsSync("../build/blog/" + node.number)) {
                        fs_1.default.mkdirSync("../build/blog/" + node.number);
                    }
                    path = "../build/blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html";
                    opengraphContents = "<meta property=\"og:title\" content=\"WhizSid| " + node.title + "\"/>";
                    opengraphContents += "<meta name=\"description\" property=\"og:description\" content=\"" + node.bodyText + "\" />";
                    opengraphContents += "<meta property=\"keywords\" content=\"" + node.labels.nodes
                        .map(function (nd) { return nd.name.split(":").pop(); })
                        .concat(["blog", "beginner", "advanced", "step by step"])
                        .join(", ") + "\" />";
                    opengraphContents += '<meta property="og:type" content="article"/>';
                    opengraphContents += "<meta property=\"og:article:published_time\" content=\"" + node.createdAt + "\"/>";
                    opengraphContents += "<meta property=\"og:article:modified_time\" content=\"" + node.updatedAt + "\"/>";
                    opengraphContents += "<meta name=\"author\" content=\"Ramesh Kithsiri\"/>";
                    opengraphContents += "<meta property=\"og:article:author:first_name\" content=\"Ramesh\"/>";
                    opengraphContents += "<meta property=\"og:article:author:last_name\" content=\"Kithsiri\"/>";
                    opengraphContents += "<meta property=\"og:article:author:username\" content=\"whizsid\"/>";
                    opengraphContents += "<meta property=\"fb:app_id\" content=\"129537969147552\"/>";
                    opengraphContents += "<meta property=\"og:article:section\" content=\"Software Engineering\"/>";
                    for (i = 0; i < node.labels.nodes.length; i++) {
                        opengraphContents += "<meta property=\"og:article:tag\" content=\"" + node.labels.nodes[i].name
                            .split(":")
                            .pop() + "\"/>";
                    }
                    imagePath = node.files.nodes.filter(function (f) {
                        return (f.path.endsWith(".png") || f.path.endsWith(".jpg")) &&
                            f.path.substr(0, 12) === "blog/images/";
                    })[0];
                    if (!imagePath) {
                        imagePath = { path: GITHUB_PAGE + "img/opengraph.png" };
                    }
                    else {
                        imagePath = {
                            path: "https://github.com/" + GITHUB_OWNER + "/" + GITHUB_REPOSITORY + "/raw/src/" + imagePath.path,
                        };
                    }
                    blogPath = (_a = node.files.nodes
                        .filter(function (f) {
                        return f.path.endsWith(".md") && f.path.substr(0, 11) === "blog/posts/";
                    })
                        .pop()) === null || _a === void 0 ? void 0 : _a.path;
                    blogPath = "https://github.com/" + GITHUB_OWNER + "/" + GITHUB_REPOSITORY + "/raw/src/" + blogPath;
                    opengraphContents += "<meta property=\"og:image\" content=\"" + imagePath.path + "\"/>";
                    opengraphContents += "<meta property=\"og:url\" content=\"" + (GITHUB_PAGE +
                        "blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html") + "\"/>";
                    if (fs_1.default.existsSync(path)) {
                        fs_1.default.unlinkSync(path);
                    }
                    sitemapContent += "\n       <url>\n\n          <loc>" + (GITHUB_PAGE +
                        "blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html") + "</loc>\n\n          <lastmod>" + node.updatedAt.substr(0, 10) + "</lastmod>\n\n          <changefreq>never</changefreq>\n\n          <priority>0.8</priority>\n\n       </url>\n    ";
                    rssContent += "\n       <item>\n            <title>" + node.title + "</title>\n            <link>" + (GITHUB_PAGE +
                        "blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html") + "</link>\n            <description>" + node.bodyText + "</description>\n            <guid>" + (GITHUB_PAGE +
                        "blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html") + "</guid>\n              <pubDate>" + (0, moment_1.default)(node.createdAt).format("ddd, DD MMM YYYY HH:mm:ss ZZ") + "</pubDate>\n              " + node.labels.nodes.map(function (n) { return "<category>" + n.name.split(":").pop() + "</category>"; }) + "\n              <comments>" + (GITHUB_PAGE +
                        "blog/" +
                        node.number +
                        "/" +
                        titleToLink(node.title) +
                        ".html") + "</comments>\n       </item>\n    ";
                    return [4 /*yield*/, axios_1.default.get(blogPath)];
                case 1:
                    blogContentResponse = _b.sent();
                    blogContent = blogContentResponse.data;
                    blogHtmlContent = mdConverter.makeHtml(blogContent);
                    fs_1.default.writeFileSync(path, indexContent.substr(0, indexHeadEnd) +
                        opengraphContents +
                        indexContent
                            .substr(indexHeadEnd + 7, indexContent.length)
                            .replace('<div id="root"></div>', "<div id=\"root\">" + blogHtmlContent + "</div>"));
                    return [2 /*return*/];
            }
        });
    });
}
function titleToLink(title) {
    return title.split(" ").join("-").toLowerCase();
}
run();
