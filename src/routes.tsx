import BlogPage from "./pages/BlogPage";
import HomePage from "./pages/HomePage";
import NotFoundErrorPage from "./pages/NotFoundErrorPage";
import SearchResultPage from "./pages/SearchResultPage";
import MainLayout from "./components/MainLayout";

export default [{
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <HomePage />
        },
        {
            path: 'index.html',
            element: <HomePage />
        },
        {
            path: 'search.html',
            element: <SearchResultPage />
        },
        {
            path: 'blog/:id/:name.html',
            element: <BlogPage />
        },
        {
            path: 'error.html',
            element: <NotFoundErrorPage />
        }
    ]
}];
