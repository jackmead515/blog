
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';

import Topbar from "./components/navigation/Topbar";
import Home from './scenes/Home';
import Blogs from './scenes/Blogs';
import Tags from "./scenes/Tags";
import About from "./scenes/About";

export default function Root() {
    return (
        <BrowserRouter>
            <Helmet>
                <link rel="canonical" href="/" />
            </Helmet>
            <Topbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blogs/:name" element={<Blogs />} />
                <Route path="/tags/:name" element={<Tags />} />
            </Routes>
        </BrowserRouter>
    )
}