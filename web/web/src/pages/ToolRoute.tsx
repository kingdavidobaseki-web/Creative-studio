import { useParams } from "react-router-dom";
import ToolPage from "../components/ToolPage";
import NotFound from "./NotFound";
import { Studio, findTool } from "../lib/tools";

export default function ToolRoute({ studio }: { studio: Studio }) {
  const { toolId } = useParams();
  const tool = findTool(studio, toolId);
  return tool ? <ToolPage tool={tool} /> : <NotFound />;
    }
