import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import StudioPage from "./pages/StudioPage";
import ToolRoute from "./pages/ToolRoute";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="music" element={<StudioPage studio="music" />} />
        <Route path="music/:toolId" element={<ToolRoute studio="music" />} />
        <Route path="video" element={<StudioPage studio="video" />} />
        <Route path="video/:toolId" element={<ToolRoute studio="video" />} />
        <Route path="projects" element={<Projects />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
