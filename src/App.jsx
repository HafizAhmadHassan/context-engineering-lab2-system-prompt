import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Api from "./pages/Api";
import Contact from "./pages/Contact";
import Practice from "./pages/Practice";
import SystemPrompt from "./pages/practice/SystemPrompt";
import Retrieval from "./pages/practice/Retrieval";
import Quiz from "./pages/practice/Quiz";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="api" element={<Api />} />
        <Route path="contact" element={<Contact />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/system-prompt" element={<SystemPrompt />} />
        <Route path="practice/system-prompt/:sessionId" element={<SystemPrompt />} />
        <Route path="practice/retrieval" element={<Retrieval />} />
        <Route path="practice/quiz" element={<Quiz />} />
      </Route>
    </Routes>
  );
}
