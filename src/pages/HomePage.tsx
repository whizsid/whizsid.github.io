import { FC } from "react";
import { Helmet } from "react-helmet";
import BlogPostsSection from "../components/HomePage/BlogPostsSection";
import Breadcrumb from "../components/HomePage/Breadcrumb";
import ContactSection from "../components/HomePage/ContactSection";
import RepositoriesSection from "../components/HomePage/RepositoriesSection";
import SkillsSection from "../components/HomePage/SkillsSection";
import { SITE_URL } from "../config";

const HomePage: FC = () => {
    return (
        <div>
            <Helmet>
                <title>WhizSid | Portfolio & Blog</title>
                <meta
                    property="og:title"
                    content="WhizSid | Portfolio & Blog"
                />
                <meta
                    name="description"
                    content="I am working as a software\
            engineer at Arimac. And also I am an undergraduate at SLIIT.\
            This is my personal website and the blog site.\
            You can check my latest blog posts and statuses with this website."
                />
                <meta
                    name="keywords"
                    content="whizsid, rust, typescript, php, github,\
            laravel, rust, sri lanka, sliit, arimac, ceylon linux, nvision, masterbrand\
            matugama, colombo, meegahathanna, experienced, developer, software engineer,\
            salesforce, iot, docker"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL} />
                <meta
                    property="og:image"
                    content={SITE_URL + "img/opengraph.png"}
                />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                />
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                <script
                    id="vertex-shader"
                    type="x-shader/x-vertex"
                >{`varying vec2 vUv;
                        void main(){
                            vUv = uv;
                            //modelViewMatrix: es la posición y orientación de la cámara dentro de la escena
                            //projectionMatrix: la proyección para la escena de la cámara incluyendo el campo de visión
                            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_Position = projectionMatrix * modelViewPosition;
                        }`}</script>
                <script
                    id="fragment-shader"
                    type="x-shader/x-fragment"
                >{`uniform float time;
                        uniform vec2 resolution;
                        uniform sampler2D texture1;

                        varying vec2 vUv;

                        void main() {
                            vec2 uv1 = vUv;
                            // variable que contiene el eje de coordenadas
                            vec2 uv = gl_FragCoord.xy/resolution.xy;

                            float frequency = 15.;
                            float amplitude = 0.015;

                            float x = uv1.y * frequency + time * .7;
                            float y = uv1.x * frequency + time * .3;

                            uv1.x += cos(x+y) * amplitude * cos(y);
                            uv1.y += sin(x-y) * amplitude * cos(y);

                            vec4 rgba = texture2D(texture1, uv1);
                            gl_FragColor = rgba;
                        }`}</script>
                <script>{`window.initSkills()`}</script>
                <style type="text/css">{`
                        @-webkit-keyframes moveXL {
                            from {
                                left: 0;
                            }

                            to {
                                left: 220px;
                            }
                        }

                        @-moz-keyframes moveXL {
                            from {
                                left: 0;
                            }

                            to {
                                left: 220px;
                            }
                        }

                        @-o-keyframes moveXL {
                            from {
                                left: 0;
                            }

                            to {
                                left: 220px;
                            }
                        }

                        @keyframes moveXL {
                            from {
                                left: 0;
                            }

                            to {
                                left: 220px;
                            }
                        }


                        @-webkit-keyframes moveXR {
                            from {
                                left: 220px;
                            }

                            to {
                                left: 0;
                            }
                        }

                        @-moz-keyframes moveXR {
                            from {
                                left: 220px;
                            }

                            to {
                                left: 0;
                            }
                        }

                        @-o-keyframes moveXR {
                            from {
                                left: 220px;
                            }

                            to {
                                left: 0;
                            }
                        }

                        @keyframes moveXR {
                            from {
                                left: 220px;
                            }

                            to {
                                left: 0;
                            }
                        }

                        @-webkit-keyframes moveYT {
                            from {
                                top: 0;
                            }

                            to {
                                top: 220px;
                            }
                        }

                        @-moz-keyframes moveYT {
                            from {
                                top: 0;
                            }

                            to {
                                top: 220px;
                            }
                        }

                        @-o-keyframes moveYT {
                            from {
                                top: 0;
                            }

                            to {
                                top: 220px;
                            }
                        }

                        @keyframes moveYT {
                            from {
                                top: 0;
                            }

                            to {
                                top: 220px;
                            }
                        }

                        @-webkit-keyframes moveYB {
                            from {
                                top: 220px;
                            }

                            to {
                                top: 0;
                            }
                        }

                        @-moz-keyframes moveYB {
                            from {
                                top: 220px;
                            }

                            to {
                                top: 0;
                            }
                        }

                        @-o-keyframes moveYB {
                            from {
                                top: 220px;
                            }

                            to {
                                top: 0;
                            }
                        }

                        @keyframes moveYB {
                            from {
                                top: 220px;
                            }

                            to {
                                top: 0;
                            }
                        }


                        @-webkit-keyframes sizeI {
                            from {
                                width: 40px;
                                height: 40px;
                                opacity: 0.5;
                            }

                            to {
                                width: 80px;
                                height: 80px;
                                opacity: 1;
                            }
                        }

                        @-moz-keyframes sizeI {
                            from {
                                width: 40px;
                                height: 40px;
                                opacity: 0.5;
                            }

                            to {
                                width: 80px;
                                height: 80px;
                                opacity: 1;
                            }
                        }

                        @-o-keyframes sizeI {
                            from {
                                width: 40px;
                                height: 40px;
                                opacity: 0.5;
                            }

                            to {
                                width: 80px;
                                height: 80px;
                                opacity: 1;
                            }
                        }

                        @keyframes sizeI {
                            from {
                                width: 40px;
                                height: 40px;
                                opacity: 0.5;
                            }

                            to {
                                width: 80px;
                                height: 80px;
                                opacity: 1;
                            }
                        }

                        @-webkit-keyframes sizeI {
                            from {
                                width: 40px;
                                height: 40px;
                                opacity: 0.5;
                            }

                            to {
                                width: 80px;
                                height: 80px;
                                opacity: 1;
                            }
                        }

                        canvas {
                            display: block;
                            position:absolute;
                            left:0;
                            top: 48px;
                            z-index:-1;
                        }
                    `}</style>
            </Helmet>
            <Breadcrumb />
            <RepositoriesSection />
            <BlogPostsSection />
            <SkillsSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;
