import { Tool } from "./tools";

// Tools that really work. Everything else stays "Coming soon".
export const isLive = (tool: Tool): boolean => tool.studio === "music" && tool.id === "analyzer";
